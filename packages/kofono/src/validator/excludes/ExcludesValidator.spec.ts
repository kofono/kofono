import { beforeEach, describe, expect, it } from "vitest";
import { SchemaBuilder } from "../../builder/SchemaBuilder";
import type { Form } from "../../form/Form";
import type { ValidationContext } from "../types";
import { ExcludesValidator } from "./ExcludesValidator";

describe("ExcludesValidator test", () => {
    let form: Form;
    let ctx: ValidationContext;

    beforeEach(async () => {
        form = await new SchemaBuilder().buildEmpty();
        ctx = {
            selector: "test",
            value: "",
            form,
        };
    });

    const validator = new ExcludesValidator("test", "validation", {
        value: "hello",
    });

    const tests: {
        value: any;
        expected: boolean;
    }[] = [
        {
            value: "hello world",
            expected: false,
        },
        {
            value: "say hello",
            expected: false,
        },
        {
            value: "world",
            expected: true,
        },
        {
            value: ["hello", "world"],
            expected: false,
        },
        {
            value: [1, 333, "hello"],
            expected: false,
        },
        {
            value: ["world"],
            expected: true,
        },
        {
            value: "",
            expected: true,
        },
        {
            value: 123,
            expected: true,
        },
        {
            value: null,
            expected: true,
        },
        {
            value: undefined,
            expected: true,
        },
        {
            value: true,
            expected: true,
        },
        {
            value: { hello: "world" },
            expected: true,
        },
    ];

    for (const test of tests) {
        it(`should return ${test.expected} for '${String(test.value)}'`, () => {
            ctx.value = test.value;
            const [isValid] = validator.validate(ctx);
            expect(isValid).toEqual(test.expected);
        });
    }

    describe("with an multiples search value", () => {
        const excludesAll = new ExcludesValidator("test", "validation", {
            value: ["hello", "world"],
        });

        const arrayValueTests: {
            value: any;
            expected: boolean;
        }[] = [
            {
                value: "hello there",
                expected: false,
            },
            {
                value: "wide world",
                expected: false,
            },
            {
                value: "wide hello there world",
                expected: false,
            },
            {
                value: "foo bar",
                expected: true,
            },
            {
                value: ["hello", "baz"],
                expected: false,
            },
            {
                value: ["baz", "world"],
                expected: false,
            },
            {
                value: ["baz", "qux"],
                expected: true,
            },
        ];

        for (const test of arrayValueTests) {
            it(`should return ${test.expected} for '${String(test.value)}'`, () => {
                ctx.value = test.value;
                const [isValid] = excludesAll.validate(ctx);
                expect(isValid).toEqual(test.expected);
            });
        }
    });
});
