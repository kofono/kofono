import {
    expression,
    type SchemaExpressionValidator,
} from "./ExpressionValidator";
import type { PlaceholderType } from "./types";

function _when(selector: string, type: PlaceholderType) {
    return {
        isEqualTo: (value: any): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "==", value]);
        },
        isTrue: (): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "==", true]);
        },
        isFalse: (): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "==", false]);
        },
        isNull: (): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "==", null]);
        },
        isNotEqualTo: (value: any): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "!=", value]);
        },
        isGreaterThan: (value: any): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, ">", value]);
        },
        isGreaterThanOrEqualTo: (value: any): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, ">=", value]);
        },
        isLessThan: (value: any): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "<", value]);
        },
        isLessThanOrEqualTo: (value: any): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "<=", value]);
        },
        includes: (value: any): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "includes", value]);
        },
        notIncludes: (value: any): SchemaExpressionValidator => {
            return expression([`{${type}:${selector}}`, "!includes", value]);
        },
    };
}

export function when(selector: string) {
    return _when(selector, "data");
}

export function whenVar(variable: string) {
    return _when(variable, "var");
}
