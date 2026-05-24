import { beforeAll, describe, expect, it } from "vitest";
import { SchemaBuilder } from "../../builder/SchemaBuilder";
import type { Form } from "../../form/Form";
import type { ValidationContext } from "../types";
import { EqualValidator, type EqualValidatorOpts } from "./EqualValidator";

describe("equalValidator", () => {
    let form: Form;
    let ctx: ValidationContext = {
        selector: "test",
        value: "",
        form: {} as Form,
    };
    beforeAll(async () => {
        form = await new SchemaBuilder().buildEmpty();
        ctx = {
            selector: "test",
            value: "",
            form: form,
        };
    });

    const tests: {
        expected: boolean;
        data: any;
        equal: EqualValidatorOpts;
    }[] = [
        {
            expected: false,
            data: "  ",
            equal: {
                value: " ",
            },
        },
        {
            expected: false,
            data: undefined,
            equal: {
                value: null,
            },
        },
        {
            expected: false,
            data: "undefined",
            equal: {
                value: null,
            },
        },
        {
            expected: false,
            data: "test",
            equal: {
                value: "test ",
            },
        },
        {
            expected: false,
            data: "test",
            equal: {
                value: " test",
            },
        },
        {
            expected: false,
            data: "test",
            equal: {
                value: "TEST",
            },
        },
        {
            expected: false,
            data: "Test",
            equal: {
                value: "TEST",
            },
        },
        {
            expected: false,
            data: "TEST",
            equal: {
                value: "test",
                caseSensitive: true,
            },
        },
        {
            expected: true,
            data: "test",
            equal: {
                value: "test",
            },
        },
        {
            expected: true,
            data: "TEST",
            equal: {
                value: "test",
                caseSensitive: false,
            },
        },
        {
            expected: true,
            data: "TEST",
            equal: {
                value: "TEST",
                caseSensitive: true,
            },
        },
    ];

    for (const test of tests) {
        it(`should return ${test.expected} when '${test.equal.value}' === '${test.data}'`, () => {
            ctx.value = test.data;
            const validator = new EqualValidator(
                ctx.selector,
                "validation",
                test.equal,
            );
            const [isValid] = validator.validate(ctx);
            expect(isValid).toEqual(test.expected);
        });
    }
});
