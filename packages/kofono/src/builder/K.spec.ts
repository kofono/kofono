import { describe, expect, it } from "vitest";
import { Form } from "../form/Form";
import { PropertyType, PropertyType as T } from "../property/types";
import { notEmpty } from "../validator/empty/NotEmptyValidator";
import { max } from "../validator/max/MaxValidator";
import { min } from "../validator/min/MinValidator";
import { K } from "./K";

describe("K builder", () => {
    it("should create simple schema", () => {
        const schema = K.schema({
            propA: K.string(),
        });

        expect(schema).toEqual({
            __: {
                propA: {
                    type: T.String,
                },
            },
        });
    });

    it("should enum normalize when creating schema", () => {
        const schema = K.schema({
            propA: K.string().enum(["option1", "option2"]),
        });
        expect(schema).toEqual({
            __: {
                propA: {
                    type: T.String,
                    enum: [{ value: "option1" }, { value: "option2" }],
                },
            },
        });
    });

    it("should create object schema", () => {
        const schema = K.object({
            propA: K.string().$v(v => v.notEmpty()),
            propB: K.boolean().$v(v => v.equal(true)),
            propC: K.number().enum([
                {
                    value: 1,
                },
                {
                    value: 2,
                },
            ]),
            propD: K.array(K.string()),
            propE: K.listBoolean().$q(q => q.isValid("propA").isValid("propB")),
            propF: K.listNumber().$v(v => v.regexp("[0-9]{1,10}", "g")),
            propG: K.listString().component({
                type: "custom",
                component: "CustomComponent",
            }),
            propH: K.listMixed(),
            propI: K.null().set("something", "else"),
            propJ: K.raw({
                type: PropertyType.Boolean,
                hello: "world",
            }),
            propK: K.string().enum(["option1", "option2"]),
        }).$q(q => q.isValid("propI"));

        expect(schema.def).toEqual({
            type: PropertyType.Object,
            $q: [
                {
                    isValid: {
                        selectors: "propI",
                    },
                },
            ],
            __: {
                propA: {
                    type: T.String,
                    $v: ["notEmpty"],
                },
                propB: {
                    type: T.Boolean,
                    $v: [
                        {
                            equal: {
                                value: true,
                            },
                        },
                    ],
                },
                propC: {
                    type: T.Number,
                    enum: [
                        {
                            value: 1,
                        },
                        {
                            value: 2,
                        },
                    ],
                },
                propD: {
                    type: T.Array,
                    items: {
                        type: "string",
                    },
                },
                propE: {
                    type: T.ListBoolean,
                    $q: [
                        {
                            isValid: {
                                selectors: "propA",
                            },
                        },
                        {
                            isValid: {
                                selectors: "propB",
                            },
                        },
                    ],
                },
                propF: {
                    $v: [
                        {
                            regexp: {
                                pattern: "[0-9]{1,10}",
                                flags: "g",
                            },
                        },
                    ],
                    type: T.ListNumber,
                },
                propG: {
                    type: T.ListString,
                    component: {
                        type: "custom",
                        component: "CustomComponent",
                    },
                },
                propH: {
                    type: T.ListMixed,
                },
                propI: {
                    something: "else",
                    type: T.Null,
                },
                propJ: {
                    type: PropertyType.Boolean,
                    hello: "world",
                },
                propK: {
                    type: "string",
                    enum: [
                        {
                            value: "option1",
                        },
                        {
                            value: "option2",
                        },
                    ],
                },
            },
        });
    });

    describe("when using expect", () => {
        it("should attach an error message to the latest validation", () => {
            const schema = K.string().$v(v =>
                v
                    .equal("test")
                    .expect("custom_error")
                    .equal("333")
                    .expect("tetet"),
            );

            expect(schema.def).toEqual({
                type: "string",
                $v: [
                    {
                        equal: {
                            error: "custom_error",
                            value: "test",
                        },
                    },
                    {
                        equal: {
                            error: "tetet",
                            value: "333",
                        },
                    },
                ],
            });
        });
    });

    describe("when schema() with $ fields", () => {
        it("should add them to schema output", async () => {
            const schema = K.schema({
                $id: "test",
                $vars: {
                    name: "foo",
                },
                $extensions: [],
                $translations: {},
                $test: "test", // should be ignored, see SchemaPropertiesDeclarations
                propA: K.string().$v(v => v.notEmpty()),
                propB: K.string().$v(v => v.notEmpty()),
            });

            expect(schema).toEqual({
                $id: "test",
                $extensions: [],
                $translations: {},
                $vars: {
                    name: "foo",
                },
                __: {
                    propA: {
                        $v: ["notEmpty"],
                        type: "string",
                    },
                    propB: {
                        $v: ["notEmpty"],
                        type: "string",
                    },
                },
            });
            // console.log(schema);
        });
    });

    describe("test form() builder", () => {
        it("should get an valid instance of form", async () => {
            const form = await K.form({
                propA: K.string().$v(v => v.notEmpty()),
            });
            expect(form).toBeInstanceOf(Form);
            expect(form.state.data).toEqual({
                propA: null,
            });
        });

        it("should have the correct id", async () => {
            const form = await K.form({
                $id: "test",
                propA: K.string().$v(v => v.notEmpty()),
            });
            expect(form.id).toBe("test");
        });
    });

    describe("test extendsSchema()", () => {
        it("get extended schema", async () => {
            const baseSchema = K.schema({
                $id: "base",
                propA: K.string(),
            });
            const schema = K.extendsSchema(baseSchema, {
                $id: "extended",
                propB: K.string(),
            });
            expect(schema).toEqual({
                $id: "extended",
                __: {
                    propA: {
                        type: "string",
                    },
                    propB: {
                        type: "string",
                    },
                },
            });
        });
    });

    describe("test functional validators declaration", () => {
        const result = {
            type: "string",
            $v: [
                {
                    notEmpty: {},
                },
                {
                    min: {
                        value: 5,
                    },
                },
            ],
        };

        it("should create a string property with validations when declared on type", () => {
            const prop = K.string(notEmpty(), min(5));
            expect(prop.def).toEqual(result);
        });

        it("should create a string property with validations", () => {
            const prop = K.string().validations(notEmpty(), min(5));
            expect(prop.def).toEqual(result);
        });

        it("should create a number property with validations", () => {
            const prop = K.string().validations(min(5));
            expect(prop.def).toEqual({
                type: "string",
                $v: [
                    {
                        min: {
                            value: 5,
                        },
                    },
                ],
            });
        });

        it("should create a string property with qualifications", () => {
            const prop = K.string().qualifications(notEmpty(), max(100));
            expect(prop.def).toEqual({
                type: "string",
                $q: [
                    {
                        notEmpty: {},
                    },
                    {
                        max: {
                            value: 100,
                        },
                    },
                ],
            });
        });
    });
});
