import { expect, test } from "vitest";
import { K, type Schema } from "../../src";

const schema: Schema = {
    $id: "my-form",
    __: {
        firstName: {
            type: "string",
            $v: [{ between: { min: 1, max: 255 } }],
        },
        lastName: {
            type: "string",
            $v: [{ between: { min: 1, max: 255 } }],
        },
        contact: {
            type: "string",
            $v: ["email"],
        },
        subject: {
            type: "string",
            enum: ["support", "sales", "technical", "security", "other"],
            $v: ["required"],
        },
        otherSubject: {
            type: "string",
            $q: [{ condition: ["{data:subject}", "==", "other"] }],
            $v: ["required"],
        },
        technicalType: {
            type: "string",
            enum: ["website", "server", "mobile", "flying car", "unknown"],
            $q: [{ condition: ["{data:subject}", "==", "technical"] }],
            $v: ["required"],
        },
        productDimension: {
            type: "object",
            $q: [{ condition: ["{data:subject}", "==", "sales"] }],
            __: {
                width: {
                    type: "number",
                    $v: ["required"],
                },
                height: {
                    type: "number",
                    $v: ["required"],
                },
                depth: {
                    type: "number",
                    $v: ["required"],
                },
            },
        },
        productTranslations: {
            type: "list<string>",
            enum: [
                "en",
                "fr",
                "es",
                "de",
                "it",
                "pt",
                "zh",
                "ja",
                "ko",
                "ar",
                "ru",
                "hi",
            ],
            default: ["en", "fr"],
            $q: [{ condition: ["{data:subject}", "==", "sales"] }],
            $v: ["required"],
        },
    },
};

test("test example002", async () => {
    const form = await K.form(schema);
    expect(form.id).toBe("my-form");

    expect(
        [
            form.isValid("firstName"),
            form.isValid("lastName"),
            form.isValid("contact"),
        ],
        "expect firstName, lastName, and contact to be invalid on start",
    ).toEqual([false, false, false]);

    expect(
        [
            form.isQualified("otherSubject"),
            form.isQualified("technicalType"),
            form.isQualified("productDimension"),
        ],
        "expect otherSubject, technicalType, and productDimension to be unqualified on start",
    ).toEqual([false, false, false]);

    await form.update("subject", "other");
    expect(
        form.isQualified("otherSubject"),
        "expect otherSubject to be qualified because subject is 'other'",
    ).toBeTruthy();

    await form.update("subject", "sales");
    expect(
        [
            form.isQualified("productDimension"),
            form.isQualified("productTranslations"),
            form.isQualified("productDimension.width"),
            form.isQualified("productDimension.height"),
            form.isQualified("productDimension.depth"),
        ],
        "expect productDimension props and productDimension to be qualified because subject is 'other'",
    ).toEqual([true, true, true, true, true]);
    expect(
        [
            form.isValid("productDimension.width"),
            form.isValid("productDimension.height"),
            form.isValid("productDimension.depth"),
        ],
        "expect productDimension props and productDimension to be qualified because subject is 'other'",
    ).toEqual([false, false, false]);

    expect(
        form.$d("productTranslations"),
        "expect productTranslations value to be equal to is default",
    ).toEqual(["en", "fr"]);
    expect(
        form.isValid("productTranslations"),
        "expect productTranslations to be valid",
    ).toBeTruthy();
});
