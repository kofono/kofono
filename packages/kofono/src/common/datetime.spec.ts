import { describe, expect, it } from "vitest";
import { isAfter, isEqual, isValid, parse } from "./datetime";

describe("isValid", () => {
    it("returns true for a valid Date", () => {
        expect(isValid(new Date("2024-01-15"))).toBe(true);
    });

    it("returns false for an Invalid Date", () => {
        expect(isValid(new Date("not-a-date"))).toBe(false);
    });

    it("returns false for a NaN Date", () => {
        expect(isValid(new Date(NaN))).toBe(false);
    });

    it("returns false for a plain string", () => {
        expect(isValid("2024-01-15")).toBe(false);
    });

    it("returns false for null", () => {
        expect(isValid(null)).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isValid(undefined)).toBe(false);
    });

    it("returns false for a number", () => {
        expect(isValid(1705276800000)).toBe(false);
    });

    it("returns true for epoch (0 is a valid timestamp)", () => {
        expect(isValid(new Date(0))).toBe(true);
    });
});

describe("parse", () => {
    const ref = new Date();

    describe("date-only formats", () => {
        it("parses yyyy-MM-dd", () => {
            const result = parse("2024-06-15", "yyyy-MM-dd", ref);
            expect(result).toEqual(new Date(2024, 5, 15));
        });

        it("parses dd/MM/yyyy", () => {
            const result = parse("15/06/2024", "dd/MM/yyyy", ref);
            expect(result).toEqual(new Date(2024, 5, 15));
        });

        it("parses yyyy.MM.dd", () => {
            const result = parse("2024.06.15", "yyyy.MM.dd", ref);
            expect(result).toEqual(new Date(2024, 5, 15));
        });
    });

    describe("datetime formats", () => {
        it("parses yyyy-MM-dd HH:mm:ss", () => {
            const result = parse(
                "2024-06-15 14:30:45",
                "yyyy-MM-dd HH:mm:ss",
                ref,
            );
            expect(result).toEqual(new Date(2024, 5, 15, 14, 30, 45));
        });

        it("parses yyyy-MM-ddTHH:mm:ss", () => {
            const result = parse(
                "2024-06-15T14:30:45",
                "yyyy-MM-ddTHH:mm:ss",
                ref,
            );
            expect(result).toEqual(new Date(2024, 5, 15, 14, 30, 45));
        });

        it("parses time-only fields (HH:mm:ss)", () => {
            const result = parse("14:30:45", "HH:mm:ss", ref);
            expect(result).toEqual(new Date(0, 0, 1, 14, 30, 45));
        });

        it("parses midnight as 00:00:00", () => {
            const result = parse(
                "2024-01-01 00:00:00",
                "yyyy-MM-dd HH:mm:ss",
                ref,
            );
            expect(result).toEqual(new Date(2024, 0, 1, 0, 0, 0));
        });

        it("parses end-of-day as 23:59:59", () => {
            const result = parse(
                "2024-01-01 23:59:59",
                "yyyy-MM-dd HH:mm:ss",
                ref,
            );
            expect(result).toEqual(new Date(2024, 0, 1, 23, 59, 59));
        });
    });

    describe("edge cases", () => {
        it("returns Invalid Date for a mismatched format", () => {
            const result = parse("15-06-2024", "yyyy-MM-dd", ref);
            expect(isValid(result)).toBe(false);
        });

        it("returns Invalid Date for an empty string", () => {
            const result = parse("", "yyyy-MM-dd", ref);
            expect(isValid(result)).toBe(false);
        });

        it("returns Invalid Date for month overflow (Feb 30)", () => {
            const result = parse("2024-02-30", "yyyy-MM-dd", ref);
            expect(isValid(result)).toBe(false);
        });

        it("returns Invalid Date for day 0", () => {
            const result = parse("2024-06-00", "yyyy-MM-dd", ref);
            expect(isValid(result)).toBe(false);
        });

        it("returns Invalid Date for month 13", () => {
            const result = parse("2024-13-01", "yyyy-MM-dd", ref);
            expect(isValid(result)).toBe(false);
        });

        it("handles leap year Feb 29 correctly", () => {
            const result = parse("2024-02-29", "yyyy-MM-dd", ref);
            expect(result).toEqual(new Date(2024, 1, 29));
        });

        it("returns Invalid Date for Feb 29 on a non-leap year", () => {
            const result = parse("2023-02-29", "yyyy-MM-dd", ref);
            expect(isValid(result)).toBe(false);
        });
    });
});

describe("isAfter", () => {
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

// ─── isEqual ────────────────────────────────────────────────────────────────

describe("isEqual", () => {
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
