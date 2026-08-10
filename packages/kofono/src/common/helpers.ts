export function objectHasKey(
    obj: Record<string, unknown>,
    key: string,
): boolean {
    if (!obj) {
        return false;
    }
    return Object.hasOwn(obj, key);
}

export function isObjectLiteral(value: unknown): value is Record<string, any> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        typeof value.constructor === "function" &&
        value.constructor.name === "Object"
    );
}

export function isEmptyString(value: unknown): boolean {
    if (typeof value !== "string") {
        return false;
    }
    return value.trim().length === 0;
}

export function lowerCaseFirst(value: unknown): string {
    if (typeof value !== "string" || value.length === 0) {
        return value as string;
    }
    return value.charAt(0).toLowerCase() + value.slice(1);
}

/**
 * Return a { key: value } object if the value is not: null,
 * undefined, an empty array, or an empty object literal.
 * Otherwise, return undefined.
 * Means to be used in object literals. ex:
 *
 * const obj1 = {
 *     firstName: "foo",
 *     middleName: null,
 *     lastName: "bar",
 *     otherNames: [],
 *     billingAddress: {},
 * };
 *
 * const obj2 = {
 *     ...optional("firstName", obj1.firstName),
 *     ...optional("middleName", obj1.middleName),
 *     ...optional("lastName", obj1.lastName),
 *     ...optional("otherNames", obj1.otherNames),
 *     ...optional("billingAddress", obj1.billingAddress),
 *     ...optional("unknownKey", obj1.unknown),
 * };
 *
 * The result:
 * obj2 = {
 *     firstName: "foo",
 *     lastName: "bar",
 * }
 */
export function optional(
    key: string,
    value: unknown,
): { [key: string]: unknown } | undefined {
    if (
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0) ||
        (isObjectLiteral(value) && Object.keys(value).length === 0)
    ) {
        return;
    }
    return {
        [key]: value,
    };
}
