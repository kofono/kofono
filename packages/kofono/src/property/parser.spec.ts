import { describe, expect, it, test } from "vitest";
import type { SchemaPropertyValidator } from "../validator/schema";
import { parseSelector, parseValidators } from "./parser";

test("parseValidators()", () => {
    const vDef: SchemaPropertyValidator[] = [
        "notEmpty",
        {
            min: 5,
        },
        "url",
        {
            password: {
                min: 5,
                max: 10,
                lowerCase: true,
            },
        },
    ];

    const result = parseValidators(vDef);
    expect(result).toHaveLength(4);
    expect(result).toEqual([
        {
            name: "notEmpty",
            options: {},
        },
        {
            name: "min",
            options: 5,
        },
        {
            name: "url",
            options: {},
        },
        {
            name: "password",
            options: {
                min: 5,
                max: 10,
                lowerCase: true,
            },
        },
    ]);
});

describe("parseSelector()", () => {
    type Scenario = [string, [boolean, string]];
    const scenarios: Scenario[] = [
        ["", [false, "selector cannot be empty."]],
        ["  ", [false, "selector cannot be empty."]],
        ["a", [true, ""]],
        ["1", [true, ""]],
        ["_", [false, "must start with"]],
        ["a1", [true, ""]],
        ["a_", [true, ""]],
        ["a.b", [true, ""]],
        ["#425sdf", [false, "must contains only"]],
        ["a..b", [false, "trailing dots"]],
    ];

    for (const [selector, expected] of scenarios) {
        it(`should return ${expected} for selector: ${selector}`, () => {
            const result = parseSelector(selector);
            expect(result.ok).toEqual(expected[0]);
            if (!result.ok) {
                expect(result.error.includes(expected[1])).toBeTruthy();
            }
        });
    }
});
