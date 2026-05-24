import { expect, test } from "vitest";
import type { Schema } from "../../schema/Schema";
import type { SchemaDeclaration } from "../types";
import {
    schemaToPropertiesDeclarations,
    separate$keysFromProps,
} from "./helpers";
import { PropertyDeclaration } from "./PropertyDeclaration";

test("separate$keysFromProps()", () => {
    const props: SchemaDeclaration = {
        $id: "test",
        $vars: {
            name: "foo",
        },
        $extensions: [],
        $special: "specialValue",
        propA: new PropertyDeclaration({
            type: "string",
        }),
        propB: new PropertyDeclaration({
            type: "string",
        }),
    };

    const [properties, schemaOptions] = separate$keysFromProps(props);

    expect(Object.keys(properties)).toEqual(["propA", "propB"]);

    expect(Object.keys(schemaOptions)).toEqual([
        "$id",
        "$vars",
        "$extensions",
        "$special",
    ]);
});

test("schemaToPropertiesDeclarations()", () => {
    const schema: Schema = {
        $id: "testSchema",
        $vars: {
            name: "foo",
        },
        $extensions: [],
        __: {
            propA: {
                type: "string",
            },
            propB: {
                type: "string",
            },
        },
    };

    const t = schemaToPropertiesDeclarations(schema);
    expect(t).toEqual({
        $id: "testSchema",
        $vars: {
            name: "foo",
        },
        $extensions: [],
        propA: new PropertyDeclaration({
            type: "string",
        }),
        propB: new PropertyDeclaration({
            type: "string",
        }),
    });
});
