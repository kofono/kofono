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
        ["a", [true, ""]],
        ["1", [true, ""]],
        [
            "_",
            [
                false,
                "selector must start with an alphanumeric character. Got: _",
            ],
        ],
        ["a1", [true, ""]],
        ["a_", [true, ""]],
        ["a.b", [true, ""]],
        [
            "#425sdf",
            [
                false,
                "selector must contains only alphanumeric, dot or underline. Got: #425sdf",
            ],
        ],
    ];

    for (const [selector, expected] of scenarios) {
        it(`should return ${expected} for selector: ${selector}`, () => {
            const [isValid, errorMessage] = parseSelector(selector);
            expect(isValid).toEqual(expected[0]);
            expect(errorMessage).toEqual(expected[1]);
        });
    }
});
