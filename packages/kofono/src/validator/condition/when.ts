import { condition, type SchemaConditionValidator } from "./ConditionValidator";
import type { PlaceholderType } from "./types";

function _when(selector: string, type: PlaceholderType) {
    return {
        isEqualTo: (value: any): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "==", value]);
        },
        isTrue: (): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "==", true]);
        },
        isFalse: (): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "==", false]);
        },
        isNull: (): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "==", null]);
        },
        isNotEqualTo: (value: any): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "!=", value]);
        },
        isGreaterThan: (value: any): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, ">", value]);
        },
        isGreaterThanOrEqualTo: (value: any): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, ">=", value]);
        },
        isLessThan: (value: any): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "<", value]);
        },
        isLessThanOrEqualTo: (value: any): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "<=", value]);
        },
        includes: (value: any): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "includes", value]);
        },
        notIncludes: (value: any): SchemaConditionValidator => {
            return condition([`{${type}:${selector}}`, "!includes", value]);
        },
    };
}

export function when(selector: string) {
    return _when(selector, "data");
}

export function whenVar(variable: string) {
    return _when(variable, "var");
}
