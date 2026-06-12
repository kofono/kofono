import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import { sameAs, sameAsValidator } from "./SameAsValidator";

describe("SameAsValidator tests", () => {
    const tests: {
        name: string;
        value: any;
        other: { selector: string; value: any };
        expected: boolean;
        error?: string;
    }[] = [
        {
            name: "should validate when value equals other field value (string)",
            value: "secret123",
            other: { selector: "password", value: "secret123" },
            expected: true,
        },
        {
            name: "should not validate when value differs from other field value",
            value: "secret123",
            other: { selector: "password", value: "different" },
            expected: false,
            error: sameAsValidator.err.NotMatch,
        },
        {
            name: "should validate when both values are equal numbers",
            value: 42,
            other: { selector: "amount", value: 42 },
            expected: true,
        },
        {
            name: "should not validate when numbers differ",
            value: 42,
            other: { selector: "amount", value: 43 },
            expected: false,
            error: sameAsValidator.err.NotMatch,
        },
        {
            name: "should validate when both values are equal booleans",
            value: true,
            other: { selector: "accepted", value: true },
            expected: true,
        },
        {
            name: "should not validate when other field is undefined",
            value: "abc",
            other: { selector: "missing", value: undefined },
            expected: false,
            error: sameAsValidator.err.NotMatch,
        },
        {
            name: "should not validate when types differ (strict equality)",
            value: "1",
            other: { selector: "code", value: 1 },
            expected: false,
            error: sameAsValidator.err.NotMatch,
        },
        {
            name: "should validate when both values are empty strings",
            value: "",
            other: { selector: "confirm", value: "" },
            expected: true,
        },
        {
            name: "should not validate when selector not found",
            value: "abc",
            other: { selector: "nonexistent", value: "xyz" },
            expected: false,
            error: sameAsValidator.err.NotMatch,
        },
    ];

    for (const test of tests) {
        it(test.name, async () => {
            const form = await K.form({
                [test.other.selector]: K.string().default(test.other.value),
                prop: K.string(sameAs(test.other.selector)).default(test.value),
            });
            expect(form.isValid("prop")).toBe(test.expected);
            if (!test.expected) {
                expect(form.prop("prop").validationError).toEqual(test.error);
            }
        });
    }
});
