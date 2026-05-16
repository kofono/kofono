import { beforeEach, describe, expect, it } from "vitest";
import { allTypes } from "../../tests/_fixtures/schemas/allTypes";
import { defaultConfig, type Form } from "../";
import { updateCounter } from "../extension/UpdateCounter/UpdateCounterExtension";
import { PropertyType } from "../property/types";
import type { Schema } from "../schema/Schema";
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
            prop1: null,
            prop2: null,
            prop3: null,
            prop5: {
                propA: null,
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

describe("SchemaBuilder testing extension", () => {
    const schemaBuilder = new SchemaBuilder();
    const schema: Schema = {
        $extensions: [
            {
                updateCounter: {},
            },
        ],
        __: {
            propA: {
                type: "string",
            },
        },
    };
    it("should have working default test extension", async () => {
        const form = await schemaBuilder.build(schema);
        expect(form.extensions).toHaveLength(1);
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

describe("SchemaBuilder testing duplicate extensions id and name", () => {
    it("should throw when one of extension id not unique", async () => {
        await expect(
            new SchemaBuilder().build({
                $extensions: [updateCounter("id1"), updateCounter("id1")],
                __: {
                    propA: {
                        type: "string",
                    },
                },
            }),
        ).rejects.toThrow(
            SchemaBuilderError.ExtensionDuplicateId.replace("{id}", "id1"),
        );
    });

    it("should throw when one of extension name without id is not unique", async () => {
        await expect(
            new SchemaBuilder().build({
                $extensions: [updateCounter(), updateCounter()],
                __: {
                    propA: {
                        type: "string",
                    },
                },
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
            new SchemaBuilder().build({
                $extensions: [updateCounter("")],
                __: {
                    propA: {
                        type: "string",
                    },
                },
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
        const form = await new SchemaBuilder().build({
            __: {
                propA: {
                    type: "string",
                    enum: ["option1", "option2"],
                },
            },
        });
        expect(form.prop("propA").get("enum", [])).toEqual([
            { value: "option1" },
            { value: "option2" },
        ]);
    });
});
