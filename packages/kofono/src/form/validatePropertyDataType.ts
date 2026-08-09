import { isObjectLiteral } from "../common/helpers";
import { PropertyType } from "../property/types";

export function validatePropertyDataType(
    type: PropertyType,
    data: unknown,
): boolean {
    switch (type) {
        case PropertyType.String:
            return typeof data === "string";
        case PropertyType.Number:
            return typeof data === "number";
        case PropertyType.BigInt:
            return typeof data === "bigint";
        case PropertyType.Boolean:
            return typeof data === "boolean";
        case PropertyType.Object:
            return isObjectLiteral(data);
        case PropertyType.Null:
            return data === null;
        case PropertyType.Unknown:
            return true;
        case PropertyType.ListBigInt:
            return (
                Array.isArray(data) &&
                data.every(item => typeof item === "bigint")
            );
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
