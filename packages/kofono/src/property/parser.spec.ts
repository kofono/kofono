import { expect, test } from "vitest";
import type { SchemaPropertyValidator } from "../validator/schema";
import { parseValidators } from "./parser";

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
