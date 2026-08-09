import { isObjectLiteral, objectHasKey } from "../common/helpers";
import type { PropertyType } from "../property/types";
import { joinParentSelector } from "../selector/helpers";
import type { SchemaPropertyValidator } from "../validator/schema";
import type { Schema, SchemaProperties, SchemaProperty } from "./Schema";

// export function o(...args: Record<string, any>[]) {
//     let result = {};
//     for (const arg of args) {
//         result = Object.assign(result, arg);
//     }
//     return result;
// }

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
            ...optional("$v", validations),
            ...optional("$q", qualifications),
        } as SchemaProperty,
    };
}

function optional(key: string, item: any): { [key: string]: any } | undefined {
    if (item === null || item === undefined) {
        return;
    }
    if (Array.isArray(item) && item.length === 0) {
        return;
    }
    return {
        [key]: item,
    };
}

export function schemaSelectors(schema: Schema): string[] {
    return _schemaSelectors([], schema.__);
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
            objectHasKey(value, "__") &&
            isObjectLiteral(value.__)
        ) {
            selectors = _schemaSelectors(selectors, value.__, selector);
        }
    }
    return selectors;
}
