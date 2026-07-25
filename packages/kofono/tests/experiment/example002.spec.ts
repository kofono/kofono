import { beforeAll, describe, expect, it } from "vitest";
import { type Form, K, QualificationError, type Schema } from "../../src";

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

describe("test example002", () => {
    let form: Form;

    beforeAll(async () => {
        form = await K.form(schema);
    });

    it("should have the correct form id", () => {
        expect(form.id).toBe("my-form");
    });

    it("expect firstName, lastName, and contact to be invalid on start", () => {
        expect([
            form.isPropValid("firstName"),
            form.isPropValid("lastName"),
            form.isPropValid("contact"),
        ]).toEqual([false, false, false]);
    });

    it("expect otherSubject, technicalType, and productDimension to be unqualified on start", () => {
        expect([
            form.isPropQualified("otherSubject"),
            form.isPropQualified("technicalType"),
            form.isPropQualified("productDimension"),
        ]).toEqual([false, false, false]);
    });

    it("expect otherSubject to not be qualified because subject is not 'other'", () => {
        expect(form.prop("otherSubject").validation).toStrictEqual([
            false,
            QualificationError.SelectorDisqualified,
        ]);
    });

    it("expect otherSubject to be qualified because subject is 'other'", async () => {
        await form.update("subject", "other");
        expect(form.isPropQualified("otherSubject")).toBeTruthy();
    });

    it("expect otherSubject to not be valid just after qualification", () => {
        expect(form.isPropValid("otherSubject")).toBeFalsy();
    });

    it("expect productDimension props and productDimension to be qualified because subject is 'sales'", async () => {
        await form.update("subject", "sales");
        expect([
            form.isPropQualified("productDimension"),
            form.isPropQualified("productTranslations"),
            form.isPropQualified("productDimension.width"),
            form.isPropQualified("productDimension.height"),
            form.isPropQualified("productDimension.depth"),
        ]).toEqual([true, true, true, true, true]);
    });

    it("expect productDimension props to be valid after qualification", () => {
        expect([
            form.isPropValid("productDimension.width"),
            form.isPropValid("productDimension.height"),
            form.isPropValid("productDimension.depth"),
        ]).toEqual([true, true, true]);
    });

    it("expect productTranslations value to be equal to its default", () => {
        expect(form.$d("productTranslations")).toEqual(["en", "fr"]);
    });

    it("expect productTranslations to be valid", () => {
        expect(form.isPropValid("productTranslations")).toBeTruthy();
    });
});
