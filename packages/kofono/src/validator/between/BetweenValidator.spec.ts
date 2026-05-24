import { beforeAll, describe, expect, it } from "vitest";
import { SchemaBuilder } from "../../builder/SchemaBuilder";
import type { Form } from "../../form/Form";
import type { ValidationContext, ValidatorResponseContext } from "../types";
import {
    BetweenValidator,
    betweenValidator,
    type SchemaBetweenValidator,
} from "./BetweenValidator";

describe("BetweenValidator test", () => {
    let form: Form;
    let ctx: ValidationContext;

    beforeAll(async () => {
        form = await new SchemaBuilder().buildEmpty();
        ctx = {
            selector: "",
            value: "",
            form: form,
        };
    });

    const minMax = (min: number, max: number) => {
        return {
            opts: {
                min,
                max,
            },
        };
    };

    const tests: {
        value: any;
        expected: boolean;
        opts: SchemaBetweenValidator["between"];
        error?: string;
        context?: ValidatorResponseContext;
    }[] = [
        {
            ...minMax(0, 10),
            expected: true,
            value: "",
            error: "",
            context: undefined,
        },
        {
            ...minMax(0, 10),
            expected: false,
            value: -1,
            error: betweenValidator.err.BelowMin,
            context: { min: 0 },
        },
        {
            ...minMax(0, 10),
            expected: false,
            value: 11,
        },
        {
            ...minMax(0, 10),
            expected: true,
            value: 0,
        },
        {
            ...minMax(0, 10),
            expected: true,
            value: 5,
        },
        {
            ...minMax(-10, 10),
            expected: true,
            value: -5.5,
        },
        {
            ...minMax(0, 10),
            expected: true,
            value: "7",
        },
        {
            ...minMax(1, Number.MAX_SAFE_INTEGER),
            expected: true,
            value: 995,
        },
        {
            ...minMax(1, 569),
            expected: false,
            value: 0,
        },
        {
            ...minMax(1, 10),
            expected: true,
            value: "test",
        },
        {
            ...minMax(1, 10),
            expected: false,
            value: "test test test",
        },
        {
            ...minMax(1, 5),
            expected: true,
            value: [0, 2],
        },
        {
            ...minMax(1, 2),
            expected: false,
            value: [0, 2, 5],
        },
    ];

    for (const test of tests) {
        it(`should return ${test.expected} for '${test.value}' with options ${JSON.stringify(
            test.opts,
        )}`, () => {
            const validator = new BetweenValidator(
                "test",
                "validation",
                test.opts,
            );
            ctx.value = test.value;
            const [isValid, error, context] = validator.validate(ctx);
            expect(isValid).toEqual(test.expected);

            if (test.error) {
                expect(error).toEqual(test.error);
            }

            if (test.context) {
                expect(context).toEqual(test.context);
            }
        });
    }
});
