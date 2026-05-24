import { beforeAll, describe, expect, it } from "vitest";
import {
    Events,
    type Form,
    K,
    notEmptyValidator,
    type ValidatorResponse,
} from "../../src";

describe("FormEvents schema events with custom events", () => {
    let f: Form;
    beforeAll(async () => {
        f = await K.form({
            propA: K.string().$v(v => v.notEmpty()),
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
                    propA: K.string().$v(x => x.notEmpty()),
                    propB: K.string().$v(x => x.notEmpty()),
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

// describe("FormEvents GlobalEvents", () => {
//     describe("when testing FormReady and FormLoading", () => {
//         let f: Form;
//         beforeAll(async () => {
//             f = await S.form({
//                 propA: S.string().$v((x) => x.notEmpty()),
//                 propB: S.string().$v((x) => x.notEmpty()),
//             }, {
//                 $id: "test-form",
//
//             }, {
//
//             });
//         });
//         it("testing FormLoading event", () => {
//             let i = 0;
//             f.events.on(Events.FormLoading, () => {
//                 i++;
//             });
//             expect(i).toEqual(1);
//         })
//     });
//
//     describe("when testing GlobalEvents", () => {
//         let f: Form;
//         beforeAll(async () => {
//             f = await S.form({
//                 propA: S.string().$v((x) => x.notEmpty()),
//                 propB: S.string().$v((x) => x.notEmpty()),
//             });
//         });
//
//         it("should be called", async () => {
//             let i = 0;
//             let j = 0;
//             f.events.on(Events.SelectorBeforeUpdate, () => {
//                 i++;
//             });
//             f.events.on(Events.SelectorAfterUpdate, () => {
//                 j++;
//             });
//             await f.update("propA", "ok");
//             expect(i).toEqual(1);
//             expect(j).toEqual(1);
//         });
//         // it("testing FormReady event", () => {
//         //     let i = 0;
//         //     f.events.on(Events.FormReady, () => {
//         //         i++;
//         //     });
//         //     expect(i).toEqual(1);
//         // })
//     });
//
//     // it("should be error VALUE_IS_EMPTY", () => {
//     //     expect(f.$v("propA")).toEqual([false, "VALUE_IS_EMPTY"]);
//     // });
// });
