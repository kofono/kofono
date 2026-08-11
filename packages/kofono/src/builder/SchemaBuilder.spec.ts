import { beforeEach, describe, expect, it } from "vitest";
import { allTypes } from "../../tests/_fixtures/schemas/allTypes";
import { defaultConfig, type Form } from "../";
import { updateCounter } from "../extension/UpdateCounter/UpdateCounterExtension";
import { PropertyType } from "../property/types";
import type { Schema } from "../schema/Schema";
import { K } from "./K";
import { SchemaBuilder, SchemaBuilderError } from "./SchemaBuilder";

describe("SchemaBuilder", () => {
    let form: Form;

    beforeEach(async () => {
        form = await new SchemaBuilder().build(allTypes);
    });

    it("should build a form", () => {
        expect(form).not.toBeNull();
    });

    it("should build a form with correct properties", () => {
        expect(form.propsKeys()).toEqual([
            "prop1",
            "prop2",
            "prop3",
            "prop4",
            "prop5",
            "prop5.propA",
            "prop6",
            "prop7",
            "prop8",
            "prop9",
            "prop10",
        ]);
    });

    it("should have the correct state", () => {
        expect(form.state.data).toEqual({
            prop1: "",
            prop2: 0,
            prop3: false,
            prop5: {
                propA: "",
            },
            prop6: [],
            prop7: [],
            prop8: [],
            prop9: [],
            prop10: [],
        });
    });

    it("should id be 'test'", async () => {
        expect(form.id).toEqual("allTypes");
    });
});

describe("SchemaBuilder testing configs", () => {
    const schemaBuilder = new SchemaBuilder();
    const schema: Schema = {
        $id: "test",
        $vars: {
            test: "test",
        },
        __: {
            propA: {
                type: PropertyType.Number,
                default: 56,
            },
        },
    };

    it("should have correct vars", async () => {
        const form = await schemaBuilder.build(schema);
        expect(form.vars).toEqual({
            test: "test",
        });
    });

    it("should have correct vars when overloading via config", async () => {
        const form = await schemaBuilder.build(schema, {
            ...defaultConfig,
            vars: {
                test: "test2",
                foo: "bar",
            },
        });
        expect(form.vars).toEqual({
            test: "test2",
            foo: "bar",
        });
    });
});

// schema prop ids should not contain dots (because of the dot notation)
describe("SchemaBuilder testing with prop id containing dot", () => {
    const schemaBuilder = new SchemaBuilder();
    const schema: Schema = {
        __: {
            "propA.A12": {
                // not allowed
                type: "string",
            },
            propA: {
                type: "object",
                __: {
                    A1: {
                        type: "string",
                    },
                },
            },
        },
    };

    it("should throw error when prop id contains dot", async () => {
        await expect(schemaBuilder.build(schema)).rejects.toThrowError(
            SchemaBuilderError.InvalidPropertyKeyName.replace(
                "{key}",
                "propA.A12",
            ),
        );
    });
});

describe("SchemaBuilder testing with wrong schemas", () => {
    it("should throw error when schema is missing root properties", async () => {
        await expect(new SchemaBuilder().build({} as any)).rejects.toThrowError(
            SchemaBuilderError.MissingRootProperties,
        );
    });

    const buildPropA = (value: any) => {
        return new SchemaBuilder().build({
            __: {
                propA: value,
            },
        } as any);
    };

    describe("should throw error when property value", () => {
        // Invalid values for property value
        const values = [
            null,
            undefined,
            true,
            false,
            1,
            "string",
            () => {},
            [],
            Symbol,
            new Date(),
        ];
        for (const value of values) {
            it(`is (${typeof value}) ${value}`, async () => {
                await expect(buildPropA(value)).rejects.toThrowError(
                    SchemaBuilderError.InvalidPropertyValue.replace(
                        "{key}",
                        "propA",
                    ),
                );
            });
        }
    });
});

describe("SchemaBuilder testing extension", () => {
    it("should with default test extension syntax one", async () => {
        const form = await K.form({
            $extensions: ["updateCounter"],
            propA: K.string(),
        });
        expect(form.extensions).toHaveLength(1);
    });

    it("should with default test extension syntax two", async () => {
        const form = await K.form({
            $extensions: [{ updateCounter: {} }],
            propA: K.string(),
        });
        expect(form.extensions).toHaveLength(1);
    });
    it("should with default test extension mixed syntax", async () => {
        const form = await K.form({
            $extensions: ["updateCounter", { updateCounter: { id: "uc2" } }],
            propA: K.string(),
        });
        expect(form.extensions).toHaveLength(2);
    });
    it("should throw when extension empty object or more than one keys", async () => {
        await expect(
            K.form({
                $extensions: [{}],
            }),
        ).rejects.toThrow(SchemaBuilderError.ExtensionInvalidConfig);

        await expect(
            K.form({
                $extensions: [
                    {
                        updateCounter: {},
                        test: "",
                    },
                ],
            }),
        ).rejects.toThrow(SchemaBuilderError.ExtensionInvalidConfig);
    });
});

describe("SchemaBuilder testing extensions id and name", () => {
    it("should throw when one of extension id not unique", async () => {
        await expect(
            K.form({
                $extensions: [updateCounter("id1"), updateCounter("id1")],
            }),
        ).rejects.toThrow(
            SchemaBuilderError.ExtensionDuplicateId.replace("{id}", "id1"),
        );
    });

    it("should throw when one of extension name without id is not unique", async () => {
        await expect(
            K.form({
                $extensions: [updateCounter(), updateCounter()],
            }),
        ).rejects.toThrow(
            SchemaBuilderError.ExtensionDuplicateName.replace(
                "{name}",
                "updateCounter",
            ),
        );
    });
    it("should throw when one of extension id is empty string", async () => {
        await expect(
            K.form({
                $extensions: [updateCounter("")],
            }),
        ).rejects.toThrow(
            SchemaBuilderError.ExtensionEmptyId.replace(
                "{name}",
                "updateCounter",
            ),
        );
    });
});

describe("SchemaBuilder testing normalization at build", () => {
    it("should normalize enum", async () => {
        const form = await K.form({
            propA: K.string().enum(["option1", "option2"]),
        });
        expect(form.prop("propA").get("enum", [])).toEqual([
            { value: "option1" },
            { value: "option2" },
        ]);
    });
});
