import { isObjectLiteral, objectHasKey, optional } from "../common/helpers";
import type { PropertyType } from "../property/types";
import { joinParentSelector } from "../selector/helpers";
import type { SchemaPropertyValidator } from "../validator/schema";
import type { Schema, SchemaProperties, SchemaProperty } from "./Schema";
import { Token } from "./Tokens";

export function property(
    id: string,
    type: PropertyType,
    validations: SchemaPropertyValidator[] = [],
    qualifications: SchemaPropertyValidator[] = [],
): {
    [key: string]: SchemaProperty;
} {
    return {
        [id]: {
            type,
            ...optional(Token.Validations, validations),
            ...optional(Token.Qualifications, qualifications),
        } as SchemaProperty,
    };
}

export function schemaSelectors(schema: Schema): string[] {
    return _schemaSelectors([], schema[Token.Properties]);
}

function _schemaSelectors(
    selectors: string[],
    props: SchemaProperties,
    prefix: string = "",
): string[] {
    for (const [key, value] of Object.entries(props)) {
        const selector = joinParentSelector(prefix, key);
        selectors.push(selector);
        if (
            isObjectLiteral(value) &&
            objectHasKey(value, Token.Properties) &&
            isObjectLiteral(value[Token.Properties])
        ) {
            selectors = _schemaSelectors(
                selectors,
                value[Token.Properties],
                selector,
            );
        }
    }
    return selectors;
}
