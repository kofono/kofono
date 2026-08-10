import { describe, expect, it } from "vitest";
import { normalizeEnumDef } from "./enum";

describe("normalizeEnumDef()", () => {
    it("should work with simple enum", () => {
        const result = normalizeEnumDef(["a", "b", "c"]);
        expect(result).toEqual([
            { value: "a" },
            { value: "b" },
            { value: "c" },
        ]);
    });

    it("should with normal enum", () => {
        const result = normalizeEnumDef([{ value: "t", label: "test" }]);
        expect(result).toEqual([{ label: "test", value: "t" }]);
    });

    it("should with mixed enum #1", () => {
        const result = normalizeEnumDef([{ value: 1 }, 2]);
        expect(result).toEqual([{ value: 1 }, { value: 2 }]);
    });

    it("should with mixed enum #2", () => {
        const result = normalizeEnumDef([1, { value: 2 }]);
        expect(result).toEqual([{ value: 1 }, { value: 2 }]);
    });
});
