/** biome-ignore-all lint/complexity/noStaticOnlyClass: I like it that way */

import { isObjectLiteral, optional } from "../common/helpers";
import { defaultConfig } from "../form/defaults";
import type { Form } from "../form/Form";
import type { FormConfig } from "../form/types";
import { PropertyType } from "../property/types";
import type {
    Schema,
    SchemaProperties,
    SchemaProperty,
} from "../schema/Schema";
import { Token } from "../schema/Tokens";
import type { SchemaPropertyValidator } from "../validator/schema";
import { buildSchema } from "./helpers";
import {
    schemaToPropertiesDeclarations,
    separate$keysFromProps,
} from "./k/helpers";
import { PropertyDeclaration } from "./k/PropertyDeclaration";
import type { SchemaDeclaration } from "./types";

export class K {
    public static async form(
        def: SchemaDeclaration | Schema,
        config: Partial<FormConfig> = defaultConfig,
    ): Promise<Form> {
        config = {
            ...defaultConfig,
            ...config,
        };

        const schema: Schema =
            "__" in def && isObjectLiteral(def.__)
                ? (def as Schema)
                : K.schema(def as SchemaDeclaration);

        return await buildSchema(schema, config as FormConfig);
    }

    public static schema(def: SchemaDeclaration): Schema {
        const [props, opts] = separate$keysFromProps(def);
        const innerBody = K.object(props);
        return {
            ...optional(Token.SchemaId, opts[Token.SchemaId]),
            ...optional(Token.SchemaVars, opts[Token.SchemaVars]),
            ...optional(Token.SchemaExtensions, opts[Token.SchemaExtensions]),
            ...optional(
                Token.SchemaTranslations,
                opts[Token.SchemaTranslations],
            ),
            __: innerBody.def.__ as SchemaProperties,
        };
    }

    public static extendsSchema(
        schema: Schema,
        def: SchemaDeclaration,
    ): Schema {
        const declarations = schemaToPropertiesDeclarations(schema);
        return K.schema({
            ...declarations,
            ...def,
        });
    }

    public static object(
        content: Record<string, PropertyDeclaration>,
    ): PropertyDeclaration {
        const schema: Record<string, SchemaProperty> = {};
        for (const [key, prop] of Object.entries(content)) {
            schema[key] = prop.def;
        }

        return new PropertyDeclaration({
            type: PropertyType.Object,
            [Token.Properties]: schema,
        });
    }

    public static raw(def: SchemaProperty): PropertyDeclaration {
        return new PropertyDeclaration(def);
    }

    public static string(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration<string> {
        return PropertyDeclaration.create(PropertyType.String, validators);
    }

    public static number(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration<number> {
        return PropertyDeclaration.create(PropertyType.Number, validators);
    }

    public static boolean(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration<boolean> {
        return PropertyDeclaration.create(PropertyType.Boolean, validators);
    }

    public static array(
        items: PropertyDeclaration,
    ): PropertyDeclaration<Array<any>> {
        return new PropertyDeclaration({
            type: PropertyType.Array,
            items: items.def,
        });
    }

    public static listBoolean(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration<boolean[]> {
        return PropertyDeclaration.create(PropertyType.ListBoolean, validators);
    }

    public static listNumber(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration<number[]> {
        return PropertyDeclaration.create(PropertyType.ListNumber, validators);
    }

    public static listString(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration<string[]> {
        return PropertyDeclaration.create(PropertyType.ListString, validators);
    }

    public static listMixed(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration<any[]> {
        return PropertyDeclaration.create(PropertyType.ListMixed, validators);
    }

    public static null(): PropertyDeclaration<never> {
        return new PropertyDeclaration({
            type: PropertyType.Null,
        });
    }
}
