export function applyModifier(modifier: string | undefined, value: any) {
    if (typeof modifier !== "string") {
        return value;
    }

    switch (modifier) {
        case "toUpperCase":
            return toUpperCase(value);
        case "toLowerCase":
            return toLowerCase(value);
        default:
            return value;
    }
}

export function toLowerCase(str: any) {
    if (typeof str !== "string") {
        return str;
    }
    return str.toLowerCase();
}

export function toUpperCase(str: any) {
    if (typeof str !== "string") {
        return str;
    }
    return str.toUpperCase();
}
