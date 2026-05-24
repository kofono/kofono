import { beforeAll, describe, expect, it } from "vitest";
import { SchemaBuilder } from "../../builder/SchemaBuilder";
import type { Form } from "../../form/Form";
import type { ValidationContext } from "../types";
import {
    NotEqualValidator,
    type NotEqualValidatorOpts,
    notEqualValidator,
} from "./NotEqualValidator";

describe("notEqualValidator", () => {
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
        notEqual: NotEqualValidatorOpts;
    }[] = [
        {
            expected: true,
            data: "  ",
            notEqual: {
                value: " ",
            },
        },
        {
            expected: true,
            data: undefined,
            notEqual: {
                value: null,
            },
        },
        {
            expected: true,
            data: "undefined",
            notEqual: {
                value: null,
            },
        },
        {
            expected: true,
            data: "test",
            notEqual: {
                value: "test ",
            },
        },
        {
            expected: true,
            data: "test",
            notEqual: {
                value: " test",
            },
        },
        {
            expected: true,
            data: "test",
            notEqual: {
                value: "TEST",
            },
        },
        {
            expected: true,
            data: "Test",
            notEqual: {
                value: "TEST",
            },
        },
        {
            expected: true,
            data: "TEST",
            notEqual: {
                value: "test",
                caseSensitive: true,
            },
        },
        {
            expected: false,
            data: "test",
            notEqual: {
                value: "test",
            },
        },
        {
            expected: false,
            data: "TEST",
            notEqual: {
                value: "test",
                caseSensitive: false,
            },
        },
        {
            expected: false,
            data: "TEST",
            notEqual: {
                value: "TEST",
                caseSensitive: true,
            },
        },
    ];

    for (const test of tests) {
        it(`should return ${test.expected} when '${test.notEqual.value}' !== '${test.data}'`, () => {
            ctx.value = test.data;
            const validator = new NotEqualValidator(
                ctx.selector,
                "validation",
                test.notEqual,
            );
            const [isValid] = validator.validate(ctx);
            expect(isValid).toEqual(test.expected);
        });
    }

    it("should return the correct error when values are equal", () => {
        ctx.value = "test";
        const validator = new NotEqualValidator(ctx.selector, "validation", {
            value: "test",
        });
        const [isValid, error] = validator.validate(ctx);
        expect(isValid).toBe(false);
        expect(error).toBe(notEqualValidator.err.IsEqual);
    });
});
