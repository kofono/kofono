import type { ValidationContext } from "../types";
import { applyModifier } from "./modifier";
import {
    type Condition,
    type ExpressionField,
    type ExpressionValue,
    type Operator,
    operators,
    type Placeholder,
    type PlaceholderList,
    type PlaceholderType,
    type Relation,
    relations,
} from "./types";

// support {type:path|modifier}
const placeholderRegex =
    /{(self|data|var|qualification|validation|def)(?::([A-Za-z0-9_.-]+))?(?:\|([A-Za-z0-9_.-]+))?}/g;

// extract placeholder from a string
export function parsePlaceholders(template: string): Placeholder[] {
    const results: Placeholder[] = [];
    const matches = template.matchAll(placeholderRegex);

    for (const match of matches) {
        const type = match[1] as PlaceholderType;
        const path = match[2] || "";
        const modifier = match[3] || undefined;

        results.push({ type, path, modifier });
    }

    return results;
}

// generate a placeholder string from a placeholder type and an optional path
export function generatePlaceholder(
    type: PlaceholderType,
    path: string = "",
    modifier?: string,
): string {
    if (modifier) {
        modifier = `|${modifier}`;
    }
    return type === "self"
        ? `{{self${modifier}}}`
        : `{{${type}:${path}${modifier}}`;
}

// try to extract placeholders from a template
export function tryParsePlaceholders(template: unknown): Placeholder[] {
    return typeof template === "string" ? parsePlaceholders(template) : [];
}

// extract placeholders from a condition
export function parseConditionPlaceholders(
    condition: Condition,
    placeholders: PlaceholderList = {},
): PlaceholderList {
    if (isSingleCondition(condition)) {
        const [field, _, value]: Condition = condition;
        const filedPH = tryParsePlaceholders(field as string);
        const valuePH = tryParsePlaceholders(value);

        if (filedPH.length > 0) {
            placeholders[field as string] = filedPH;
        }
        if (valuePH.length > 0) {
            placeholders[value] = valuePH;
        }
    } else if (isChainedCondition(condition)) {
        for (let i = 0; i < (condition as Condition).length; i += 2) {
            placeholders = {
                ...placeholders,
                ...parseConditionPlaceholders(
                    condition[i] as Condition,
                    placeholders,
                ),
            };
        }
        return placeholders;
    }

    return placeholders;
}

// extract all selectors from PlaceholderList
export function placeholdersListToSelectors(
    placeholders: PlaceholderList,
): string[] {
    const selectors: string[] = [];
    for (const phs of Object.values(placeholders)) {
        for (const ph of phs) {
            if (["data", "qualifications", "validations"].includes(ph.type)) {
                selectors.push(ph.path);
            }
        }
    }
    return selectors;
}

// resolves placeholders in a field value
export function evaluateFieldValue(
    fieldValue: ExpressionField | ExpressionValue,
    context: ValidationContext,
    placeholders: PlaceholderList = {},
): any {
    let newValue = fieldValue;
    if (typeof fieldValue === "string" && placeholders[fieldValue]) {
        for (const ph of placeholders[fieldValue]) {
            const placeHolderStr = generatePlaceholder(
                ph.type,
                ph.path,
                ph.modifier,
            );
            const contextValue = placeholderToContextValue(ph, context);

            if (placeholders[fieldValue].length === 1) {
                // reuse replacingValue as is if there is only one placeholder
                return contextValue;
            } else if (contextValue !== undefined) {
                // in case of multiple placeholders, replace all occurrences of the placeholder
                // note: newValue type will be a string
                newValue = newValue.replaceAll(
                    placeHolderStr,
                    contextValue as string,
                );
            }
        }
    }
    return newValue;
}

// resolve the value of a placeholder with the help of validation the context
function placeholderToContextValue(
    ph: Placeholder,
    context: ValidationContext,
) {
    const { type, path } = ph;
    switch (type) {
        case "self":
            return applyModifier(
                ph.modifier,
                context.form.$d(context.selector),
            );
        case "data":
            return applyModifier(ph.modifier, context.form.$d(path));
        case "var":
            return applyModifier(ph.modifier, context.form.var(path));
        case "qualification":
            return applyModifier(
                ph.modifier,
                context.form.prop(path)?.isQualified() ?? false,
            );
        case "validation":
            return applyModifier(
                ph.modifier,
                context.form.prop(path)?.isValid() ?? false,
            );
        case "def":
            return applyModifier(
                ph.modifier,
                context.form.prop(context.selector).get(path, undefined),
            );
        default:
            return undefined;
    }
}

function isValidOperator(operator: unknown): operator is Operator {
    return operators.includes(operator as Operator);
}

function isValidRelation(relation: unknown): relation is Relation {
    return relations.includes(relation as Relation);
}

function isSingleCondition(condition: unknown): condition is Condition {
    return (
        Array.isArray(condition) &&
        condition.length === 3 &&
        typeof condition[0] === "string" &&
        isValidOperator(condition[1])
    );
}

function combine(a: boolean, relation: Relation, b: boolean): boolean {
    if (relation === "and") {
        return a && b;
    }
    if (relation === "or") {
        return a || b;
    }
    return false; // should be unreachable if the relation is correct
}

/**
 * A "node" condition is either a single leaf, or a chained expression array:
 *   [cond0, rel1, cond1, rel2, cond2, ...]
 *
 * This validator accepts ANY odd-length >= 3 array where:
 * - even indices (0,2,4,...) are conditions (single or chained)
 * - odd indices (1,3,5,...) are relations
 */
function isChainedCondition(condition: unknown): condition is Condition {
    if (
        !Array.isArray(condition) ||
        condition.length < 3 ||
        condition.length % 2 === 0
    ) {
        return false;
    }

    for (let i = 0; i < condition.length; i++) {
        const item = condition[i];
        if (i % 2 === 0) {
            // condition position
            if (!(isSingleCondition(item) || isChainedCondition(item)))
                return false;
        } else {
            // relation position
            if (!isValidRelation(item)) {
                return false;
            }
        }
    }

    return true;
}

// execute a condition
export function evaluateCondition(
    condition: Condition,
    context: ValidationContext,
    placeholders: PlaceholderList = {},
): boolean {
    if (isSingleCondition(condition)) {
        const [field, operator, value] = condition;

        // change placeholders to their respective values
        const processedField = evaluateFieldValue(field, context, placeholders);
        const processedValue = evaluateFieldValue(value, context, placeholders);

        // evaluate based on an operator
        switch (operator) {
            case "==":
                // biome-ignore lint/suspicious/noDoubleEquals: we may have to compare "23" to 23
                return processedField == processedValue;
            case "!=":
                // biome-ignore lint/suspicious/noDoubleEquals: we may have to compare "23" to 23
                return processedField != processedValue;
            case ">":
                return processedField > processedValue;
            case "<":
                return processedField < processedValue;
            case ">=":
                return processedField >= processedValue;
            case "<=":
                return processedField <= processedValue;
            case "includes":
                if (
                    typeof processedField === "string" ||
                    Array.isArray(processedField)
                ) {
                    return processedField.includes(processedValue);
                }
                return false;
            case "!includes":
                if (
                    typeof processedField === "string" ||
                    Array.isArray(processedField)
                ) {
                    return !processedField.includes(processedValue);
                }
                return false;
            default:
                // biome-ignore lint/suspicious/noConsole: alert the user that the operator is unknown
                console.warn(`Unknown operator: ${operator}`);
                return false;
        }
    }

    if (isChainedCondition(condition)) {
        let acc = evaluateCondition(
            condition[0] as Condition,
            context,
            placeholders,
        );

        for (let i = 1; i < (condition as Condition).length; i += 2) {
            const rel = condition[i] as Relation;
            const nextCond = condition[i + 1] as Condition;

            const nextValue = evaluateCondition(
                nextCond,
                context,
                placeholders,
            );

            acc = combine(acc, rel, nextValue);
        }

        return acc;
    }

    // fallback: return false for invalid conditions
    return false;
}
