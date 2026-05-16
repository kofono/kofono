import { describe, expect, it } from "vitest";
import { isAfter, isEqual, isValid, parse } from "./datetime";

describe("datetime isValid()", () => {
    const tests: [title: string, value: any, expected: boolean][] = [
        ["valid Date object", new Date("2024-01-15"), true],
        ["invalid Date object", new Date("not-a-date"), false],
        ["NaN date", new Date(NaN), false],
        ["plain string", "2024-01-15", true],
        ["plain string with time", "2024-01-15 2:00", true],
        ["plain string with text", "2024-01-15 hello", false],
        ["null", null, false],
        ["undefined", undefined, false],
        ["random number", 1705276800000, true],
        ["invalid minutes", "2023-01-01 12:60:45", false],
        ["invalid seconds", "2023-01-01 12:34:60", false],
        ["invalid years", "999999-01-01", false],
    ];

    for (const [title, value, expected] of tests) {
        it(title, () => {
            expect(isValid(value)).toBe(expected);
        });
    }
});

describe("datetime parse()", () => {
    const ref = new Date();

    const tests: [format: string, value: string, expected: any][] = [
        ["yyyy-MM-dd", "2024-06-15", new Date(2024, 5, 15)],
        ["dd/MM/yyyy", "15/06/2024", new Date(2024, 5, 15)],
        ["yyyy.MM.dd", "2024.06.15", new Date(2024, 5, 15)],
        [
            "yyyy-MM-dd HH:mm:ss",
            "2024-06-15 14:30:45",
            new Date(2024, 5, 15, 14, 30, 45),
        ],
        [
            "yyyy-MM-ddTHH:mm:ss",
            "2024-06-15T14:30:45",
            new Date(2024, 5, 15, 14, 30, 45),
        ],
        ["HH:mm:ss", "14:30:45", new Date(0, 0, 1, 14, 30, 45)],
        ["HH:mm:ss", "00:00:00", new Date(0, 0, 1, 0, 0, 0)],
        ["HH:mm:ss", "23:59:59", new Date(0, 0, 1, 23, 59, 59)],
        ["HH:mm:ss", "50:35:90", undefined], // invalid time
        ["yyyy-MM-dd", "15-06-2024", undefined], // wrong format
        ["yyyy-MM-dd", "", undefined], // empty string
        ["yyyy-MM-dd", "2024-02-30", undefined], // month overflow
        ["yyyy-MM-dd", "2024-06-00", undefined], // day 0
        ["yyyy-MM-dd", "2024-13-01", undefined], // month overflow
        ["yyyy-MM-dd", "2024-02-29", new Date(2024, 1, 29)], // leap year Feb 29
        ["yyyy-MM-dd", "2023-02-29", undefined], // non-leap year Feb 29
    ];

    for (const [format, value, expected] of tests) {
        const title =
            expected === false
                ? `should not parse format ${format} when value is ${value}`
                : `should parse format ${format} when value is ${value}`;

        it(title, () => {
            const result = parse(value, format, ref);
            expect(result).toEqual(expected);
        });
    }
});

describe("datetime isAfter()", () => {
    const earlier = new Date(2024, 0, 1);
    const later = new Date(2024, 5, 15);

    it("returns true when left is after right", () => {
        expect(isAfter(later, earlier)).toBe(true);
    });

    it("returns false when left is before right", () => {
        expect(isAfter(earlier, later)).toBe(false);
    });

    it("returns false when both dates are equal", () => {
        expect(isAfter(earlier, new Date(2024, 0, 1))).toBe(false);
    });

    it("handles millisecond-level precision", () => {
        const a = new Date(2024, 0, 1, 0, 0, 0, 0);
        const b = new Date(2024, 0, 1, 0, 0, 0, 1);
        expect(isAfter(b, a)).toBe(true);
        expect(isAfter(a, b)).toBe(false);
    });

    it("works across year boundaries", () => {
        expect(isAfter(new Date(2025, 0, 1), new Date(2024, 11, 31))).toBe(
            true,
        );
    });
});

describe("datetime isEqual()", () => {
    it("returns true for two identical dates", () => {
        expect(isEqual(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(true);
    });

    it("returns false for two different dates", () => {
        expect(isEqual(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
    });

    it("returns true for the same timestamp constructed differently", () => {
        const a = new Date(2024, 5, 15, 12, 0, 0);
        const b = new Date(a.getTime());
        expect(isEqual(a, b)).toBe(true);
    });

    it("returns false when dates differ by 1ms", () => {
        const a = new Date(2024, 0, 1, 0, 0, 0, 0);
        const b = new Date(2024, 0, 1, 0, 0, 0, 1);
        expect(isEqual(a, b)).toBe(false);
    });

    it("is symmetric", () => {
        const a = new Date(2024, 3, 10);
        const b = new Date(2024, 3, 10);
        expect(isEqual(a, b)).toBe(isEqual(b, a));
    });

    it("returns true for epoch vs epoch", () => {
        expect(isEqual(new Date(0), new Date(0))).toBe(true);
    });
});
