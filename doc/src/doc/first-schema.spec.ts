import { between, email, K, Schema } from "kofono";

export const intro: Schema = {
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
        middleName: {
            type: "string",
            $v: [{ between: { min: 1, max: 255 } }],
        },
        mainContact: {
            type: "string",
            $v: ["email"],
        },
    },
};

export const intro2: Schema = {
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
            enum: ["en", "fr", "es", "de", "it", "pt", "zh", "ja", "ko", "ar", "ru", "hi"],
            default: ["en", "fr"],
            $q: [{ condition: ["{data:subject}", "==", "sales"] }],
            $v: ["required"],
        },
    },
};

const form = await K.form({
    $id: "my-form",
    firstName: K.string(between(1, 255)),
    lastName: K.string(between(1, 255)),
    mainContact: K.string(email()),
});

export { form };
