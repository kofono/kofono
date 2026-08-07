import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";

describe("IfValidator test", () => {
    it("should execute correctly according to the condition provided", async () => {
        const form = await K.form({
            propA: K.string().default("a"),
            propB: K.string()
                .default("yes")
                .validations({
                    if: {
                        condition: ["{data:propA}", "==", "a"],
                        then: ["empty"],
                    },
                }),
        });
        expect(form.prop("propB").isValid()).toBe(false);
        await form.update("propA", "b");
        expect(form.prop("propB").isValid()).toBe(true);
    });

    it("should execute correctly according to the condition provided", async () => {
        const form = await K.form({
            propA: K.string().default("a"),
            propB: K.number()
                .default(1)
                .validations({
                    if: {
                        condition: ["{data:propA}", "==", "a"],
                        then: [{ min: 4 }],
                    },
                }),
        });
        expect(form.prop("propB").isValid()).toBe(false);

        await form.update("propA", "b");
        expect(form.prop("propB").isValid()).toBe(true);

        await form.update("propA", "a");
        expect(form.prop("propB").isValid()).toBe(false);

        await form.update("propB", 5);
        expect(form.prop("propB").isValid()).toBe(true);
    });

    it("should execute correctly according to a true condition", async () => {
        const form = await K.form({
            propA: K.string().default("a"),
            propB: K.string()
                .default("yes")
                .validations({
                    if: {
                        condition: ["a", "==", "a"],
                        then: ["empty"],
                    },
                }),
        });
        expect(form.prop("propB").isValid()).toBe(false);
        await form.update("propB", "");
        expect(form.prop("propB").isValid()).toBe(true);
    });
});
