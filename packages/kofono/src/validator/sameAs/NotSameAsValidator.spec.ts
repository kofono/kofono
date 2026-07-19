import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import { notSameAs, notSameAsValidator } from "./NotSameAsValidator";

describe("NotSameAsValidator tests", () => {
    const tests: {
        name: string;
        value: any;
        other: { selector: string; value: any };
        expected: boolean;
        error?: string;
    }[] = [
        {
            name: "should not validate when value equals other field value (string)",
            value: "secret123",
            other: { selector: "password", value: "secret123" },
            expected: false,
            error: notSameAsValidator.err.Match,
        },
        {
            name: "should validate when value differs from other field value",
            value: "secret123",
            other: { selector: "password", value: "different" },
            expected: true,
        },
        {
            name: "should not validate when both values are equal numbers",
            value: 42,
            other: { selector: "amount", value: 42 },
            expected: false,
            error: notSameAsValidator.err.Match,
        },
        {
            name: "should validate when numbers differ",
            value: 42,
            other: { selector: "amount", value: 43 },
            expected: true,
        },
        {
            name: "should not validate when both values are equal booleans",
            value: true,
            other: { selector: "accepted", value: true },
            expected: false,
            error: notSameAsValidator.err.Match,
        },
        {
            name: "should validate when other field is undefined",
            value: "abc",
            other: { selector: "missing", value: undefined },
            expected: true,
        },
        {
            name: "should validate when types differ (strict equality)",
            value: "1",
            other: { selector: "code", value: 1 },
            expected: true,
        },
        {
            name: "should not validate when both values are empty strings",
            value: "",
            other: { selector: "confirm", value: "" },
            expected: false,
            error: notSameAsValidator.err.Match,
        },
        {
            name: "should validate when selector not found",
            value: "abc",
            other: { selector: "nonexistent", value: "xyz" },
            expected: true,
        },
        {
            name: "should not validate when both values are null",
            value: null,
            other: { selector: "other", value: null },
            expected: false,
            error: notSameAsValidator.err.Match,
        },
    ];

    for (const test of tests) {
        it(test.name, async () => {
            const form = await K.form({
                [test.other.selector]: K.string().default(test.other.value),
                prop: K.string(notSameAs(test.other.selector)).default(
                    test.value,
                ),
            });

            expect(form.isValid("prop")).toBe(test.expected);
            if (!test.expected) {
                expect(form.prop("prop").validationError).toEqual(test.error);
            }
        });
    }

    it("should throw when selector does not exist", async () => {
        await expect(() => {
            return K.form({
                prop: K.string(notSameAs("something.else")).default("value"),
            });
        }).rejects.toThrow();
    });
});
