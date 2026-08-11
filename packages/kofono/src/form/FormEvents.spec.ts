import { beforeAll, describe, expect, it } from "vitest";
import {
    Events,
    type Form,
    type FormConfig,
    K,
    notEmptyValidator,
    type ValidatorResponse,
} from "../../src";
import { FormEvents } from "./FormEvents";

describe("FormEvents schema events with custom events", () => {
    let f: Form;
    beforeAll(async () => {
        f = await K.form({
            propA: K.string("notEmpty"),
        });
        f.events.onSelectorValidation(
            "propA",
            ({ value }): ValidatorResponse => {
                return value !== "FOO"
                    ? [false, "CUSTOM_VALIDATION"]
                    : [true, ""];
            },
        );
    });

    it("should be error VALUE_IS_EMPTY", () => {
        expect(f.$v("propA")).toEqual([false, notEmptyValidator.err.IsEmpty]);
    });

    it("should be error CUSTOM_VALIDATION", async () => {
        await f.update("propA", "BAR");
        expect(f.$v("propA")).toEqual([false, "CUSTOM_VALIDATION"]);
    });

    it("should be valid after updating propA with bar", async () => {
        await f.update("propA", "FOO");
        expect(f.$v("propA")).toEqual([true, ""]);
    });
});

describe("FormEvents GlobalEvents", () => {
    describe("when testing FormReady and FormLoading", () => {
        let i = 0;

        it("testing FormLoading event", async () => {
            await K.form(
                {
                    propA: K.string("notEmpty"),
                    propB: K.string("notEmpty"),
                },
                {
                    init: x => {
                        x.form.events.on(Events.FormLoading, () => {
                            i++;
                        });
                    },
                },
            );
            expect(i).toEqual(1);
        });
    });
});

describe("FormEvents.emitSelectorTree circular dependency", () => {
    it("should detect, limit and stop the circular behavior", async () => {
        type FlipOpts = { target: string };

        function flip(target: string): { flip: FlipOpts } {
            return { flip: { target } };
        }

        let totalCalls = 0;
        const callsBySelector: Record<string, number> = {};
        const config: Partial<FormConfig> = {
            init: ctx => {
                ctx.addValidator<FlipOpts>(
                    "flip",
                    async (v, { selector }) => {
                        callsBySelector[selector] =
                            (callsBySelector[selector] ?? 0) + 1;
                        const n = callsBySelector[selector];
                        totalCalls++;
                        if (totalCalls > 10000) {
                            throw new Error(
                                `unbounded recursion: ${totalCalls} calls`,
                            );
                        }
                        return n % 2 === 0 ? v.success() : v.error("X");
                    },
                    // dependency on the other selector
                    v => [v.opts.target],
                );
            },
        };

        const form = await K.form(
            {
                // @ts-expect-error
                a: K.string(flip("b")),
                // @ts-expect-error
                b: K.string(flip("a")), // that's gonna flip for sure!
            },
            config,
        );

        // the MAX_TREE_VISITS should prevent the circular recursion
        await form.update("a", "x");

        const initialUpdatePerSelector = 2;

        // (MAX_TREE_VISITS x 2 props) + (2 initial update x 2 props) + 1 extra update (the flip start)
        expect(totalCalls).toBe(
            FormEvents.MAX_TREE_VISITS * 2 + initialUpdatePerSelector * 2 + 1,
        );
        // MAX_TREE_VISITS + 2 initial update + 1 extra update (the flip start)
        expect(callsBySelector.a).toBe(
            FormEvents.MAX_TREE_VISITS + initialUpdatePerSelector + 1,
        );
        // MAX_TREE_VISITS + 2 initial update
        expect(callsBySelector.b).toBe(
            FormEvents.MAX_TREE_VISITS + initialUpdatePerSelector,
        );
    });
});
