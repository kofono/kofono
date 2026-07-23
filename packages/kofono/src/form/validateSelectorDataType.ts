import { isObjectLiteral } from "../common/helpers";
import { PropertyType } from "../property/types";
import type { Form } from "./Form";

export function validateSelectorDataType(
    form: Form,
    selector: string,
    data: unknown,
): boolean {
    const propType = form.prop(selector).type;

    switch (propType) {
        case PropertyType.String:
            return typeof data === "string";
        case PropertyType.Number:
            return typeof data === "number";
        case PropertyType.Boolean:
            return typeof data === "boolean";
        case PropertyType.Object:
            return isObjectLiteral(data);
        case PropertyType.Null:
            return data === null;
        case PropertyType.Unknown:
            return true;
        case PropertyType.ListBoolean:
            return (
                Array.isArray(data) &&
                data.every(item => typeof item === "boolean")
            );
        case PropertyType.ListString:
            return (
                Array.isArray(data) &&
                data.every(item => typeof item === "string")
            );
        case PropertyType.ListNumber:
            return (
                Array.isArray(data) &&
                data.every(item => typeof item === "number")
            );
        case PropertyType.ListMixed:
            return Array.isArray(data);

        case PropertyType.Array:
            // TODO: should check definition of array items
            return Array.isArray(data);
    }
}

export function validateSelectorCurrentDataType(
    form: Form,
    selector: string,
): boolean {
    const data = form.$d(selector);
    return validateSelectorDataType(form, selector, data);
}
