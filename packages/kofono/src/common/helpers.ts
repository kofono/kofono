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

export function uuidV4(): string {
    return crypto.randomUUID();
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

export function optional(key: string, value: unknown): Record<string, unknown> {
    return value === undefined ? {} : { [key]: value };
}
