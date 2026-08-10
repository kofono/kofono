import { failResult, okResult, type Result } from "../common/result";
import type { SchemaPropertyValidator } from "../validator/schema";
import { PropertyType, type PropertyValidator, TreeType } from "./types";

/**
 * Transform property raw validators definition into PropertyValidator[] format
 */
export function parseValidators(
    validationDef: SchemaPropertyValidator[],
): PropertyValidator[] {
    const validators: PropertyValidator[] = [];

    for (const validator of validationDef) {
        let validatorName: string = "";
        let validatorOptions: Record<string, unknown> = {};

        if (typeof validator === "object") {
            // we assume here that there is only one key in the object, and it is the name
            // of the validator, but we don't know it yet
            // ex: { "min": ...options }
            for (const [valKey, options] of Object.entries(validator)) {
                validatorName = valKey;
                validatorOptions = options;
                break;
            }
        } else if (typeof validator === "string") {
            validatorName = validator;
        }

        if (validatorName.trim() === "") {
            throw new Error(`Invalid validator definition`);
        }

        validators.push({
            name: validatorName,
            options: validatorOptions,
        });
    }
    return validators;
}

/**
 * Determine the property type and the tree type from the given type.
 * todo refact
 */
export function determinePropertyTypes(type: string): [PropertyType, TreeType] {
    switch (type) {
        case PropertyType.Object:
            return [PropertyType.Object, TreeType.Node];
        case PropertyType.BigInt:
            return [PropertyType.BigInt, TreeType.Leaf];
        case PropertyType.String:
            return [PropertyType.String, TreeType.Leaf];
        case PropertyType.Number:
            return [PropertyType.Number, TreeType.Leaf];
        case PropertyType.Boolean:
            return [PropertyType.Boolean, TreeType.Leaf];
        case PropertyType.Array:
            return [PropertyType.Array, TreeType.Node];
        case PropertyType.Null:
            return [PropertyType.Null, TreeType.Leaf];
        case PropertyType.ListBigInt:
            return [PropertyType.ListBigInt, TreeType.Leaf];
        case PropertyType.ListString:
            return [PropertyType.ListString, TreeType.Leaf];
        case PropertyType.ListNumber:
            return [PropertyType.ListNumber, TreeType.Leaf];
        case PropertyType.ListBoolean:
            return [PropertyType.ListBoolean, TreeType.Leaf];
        case PropertyType.ListMixed:
            return [PropertyType.ListMixed, TreeType.Leaf];
        default:
            return [PropertyType.Unknown, TreeType.Leaf];
    }
}

/**
 * Validate a given selector respect basic rules
 */
export function parseSelector(selector: string): Result {
    if (selector.trim() === "") {
        return failResult("selector cannot be empty.");
    }
    const onlyAlphaNumeric = /^[a-zA-Z0-9._]+$/;
    if (!onlyAlphaNumeric.test(selector)) {
        return failResult(
            `selector must contains only alphanumeric, underline and dot characters. Got: ${selector}`,
        );
    }
    const startsWithAlphanumeric = /^[a-zA-Z0-9]/;
    if (!startsWithAlphanumeric.test(selector)) {
        return failResult(
            `selector must start with an alphanumeric character. Got: ${selector}`,
        );
    }
    if (selector.split(".").some(segment => segment === "")) {
        return failResult(
            `selector must not contain empty segments (consecutive or trailing dots). Got: ${selector}`,
        );
    }
    return okResult();
}
