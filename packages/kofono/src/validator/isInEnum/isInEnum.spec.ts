import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { ValidationContext } from "../types";
import { isInEnum } from "./isInEnum";

describe("isInEnum validator", () => {
    const tests: [selector: string, value: any, expected: boolean][] = [
        ["propA", "a", true],
        ["propA", null, false],
        ["propA", undefined, false],
        ["propA", "d", false],
        ["propB", ["a", "b"], true],
        ["propB", ["a", "d"], false],
        ["propB", ["a", "b", "c"], true],
        ["propB", ["a", "a", "a"], true],
        ["propB", ["a", "a", "a", ""], false],
        ["propC", [true, false], true],
        ["propC", [true, true], true],
        ["propC", [true, false, 0], false],
        ["propD", [0, 1, 2, -3], true],
        ["propD", [0, 1, 2, -3, 4], false],
    ];

    for (const test of tests) {
        const [selector, value, expected] = test;
        it(`should return ${expected} for '${JSON.stringify(value)}'`, async () => {
            const form = await K.form({
                propA: K.string().enum(["a", "b", "c"]),
                propB: K.listString().enum(["a", "b", "c"]),
                propC: K.listBoolean().enum([true, false]),
                propD: K.listNumber().enum([0, 1, 2, -3]),
            });
            const ctx: ValidationContext = {
                selector,
                form,
                value,
            };
            expect(isInEnum(ctx)).toBe(expected);
        });
    }
});
