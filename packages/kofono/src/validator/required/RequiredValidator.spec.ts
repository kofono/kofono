import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { ValidationContext } from "../types";
import { RequiredValidator } from "./RequiredValidator";

describe("requiredValidator", () => {
    const ctx: ValidationContext = {
        form: {} as any,
        selector: "test",
        value: undefined,
    };

    const validator = new RequiredValidator(ctx.selector, "validation", {});

    const tests: {
        name: string;
        value: any;
        expected: boolean;
    }[] = [
        {
            name: "should be invalid for undefined",
            value: undefined,
            expected: false,
        },
        {
            name: "should be invalid for null",
            value: null,
            expected: false,
        },
        {
            name: "should be invalid for empty string",
            value: "",
            expected: false,
        },
        {
            name: "should be invalid for whitespaces only string",
            value: "   ",
            expected: false,
        },
        {
            name: "should be invalid for boolean false",
            value: false,
            expected: false,
        },
        {
            name: "should be invalid for empty array",
            value: [],
            expected: false,
        },
        {
            name: "should be valid for non-empty string",
            value: "a",
            expected: true,
        },
        {
            name: "should be valid for boolean true",
            value: true,
            expected: true,
        },
        {
            name: "should be valid for non-empty array",
            value: [1],
            expected: true,
        },
        {
            name: "should be valid for number 0",
            value: 0,
            expected: true,
        },
        {
            name: "should be valid for object",
            value: { a: 1 },
            expected: true,
        },
    ];

    for (const t of tests) {
        it(t.name, async () => {
            ctx.form = await K.form({
                test: K.string("required"),
            });
            ctx.value = t.value;
            const [isValid, _] = validator.validate(ctx);
            expect(isValid).toBe(t.expected);
        });
    }

    it("should respect enum values is set", async () => {
        const form = await K.form({
            prop: K.string("required").enum(["a", "b", "c"]),
        });

        expect(form.isValid("prop")).toBe(false);
        await form.update("prop", "z");
        expect(form.isValid("prop")).toBe(false);
        await form.update("prop", "a");
        expect(form.isValid("prop")).toBe(true);
    });
});
