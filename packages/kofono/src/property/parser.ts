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
 */
export function determinePropertyTypes(type: string): [PropertyType, TreeType] {
    switch (type) {
        case PropertyType.Object:
            return [PropertyType.Object, TreeType.Node];
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
