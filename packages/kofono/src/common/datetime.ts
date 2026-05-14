/**
 * Port from date-fns
 */

/**
 * Checks whether a Date object is valid (not Invalid Date).
 */
export function isValid(date: unknown): boolean {
    return date instanceof Date && !Number.isNaN(date.getTime());
}

/**
 * Parses a date string using a format string.
 * Supports tokens: yyyy, MM, dd, HH, mm, ss
 *
 * Returns an Invalid Date if parsing fails.
 */
export function parse(
    dateStr: string,
    formatStr: string,
    _referenceDate: Date,
): Date {
    const tokenMap: Record<string, string> = {
        yyyy: "(?<year>\\d{4})",
        MM: "(?<month>\\d{2})",
        dd: "(?<day>\\d{2})",
        HH: "(?<hours>\\d{2})",
        mm: "(?<minutes>\\d{2})",
        ss: "(?<seconds>\\d{2})",
    };

    let regexStr = formatStr;
    for (const [token, capture] of Object.entries(tokenMap)) {
        regexStr = regexStr.replace(token, capture);
    }

    const match = new RegExp(`^${regexStr}$`).exec(dateStr);
    if (!match?.groups) {
        return new Date(NaN);
    }

    const g = match.groups;
    const year = parseInt(g.year ?? "0", 10);
    const month = parseInt(g.month ?? "1", 10) - 1;
    const day = parseInt(g.day ?? "1", 10);
    const hours = parseInt(g.hours ?? "0", 10);
    const minutes = parseInt(g.minutes ?? "0", 10);
    const seconds = parseInt(g.seconds ?? "0", 10);

    const result = new Date(year, month, day, hours, minutes, seconds);

    // Only validate fields that were present in the format string
    if (g.year !== undefined && result.getFullYear() !== year) {
        return new Date(NaN);
    }
    if (g.month !== undefined && result.getMonth() !== month) {
        return new Date(NaN);
    }
    if (g.day !== undefined && result.getDate() !== day) {
        return new Date(NaN);
    }

    return result;
}

/**
 * Returns true if dateLeft is after dateRight.
 */
export function isAfter(dateLeft: Date, dateRight: Date): boolean {
    return dateLeft.getTime() > dateRight.getTime();
}

/**
 * Returns true if dateLeft and dateRight represent the same point in time.
 */
export function isEqual(dateLeft: Date, dateRight: Date): boolean {
    return dateLeft.getTime() === dateRight.getTime();
}
