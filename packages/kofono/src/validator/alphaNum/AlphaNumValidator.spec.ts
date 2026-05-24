import { describe, expect, it } from "vitest";
import type { ValidationContext } from "../types";
import {
    AlphaNumValidator,
    type AlphaNumValidatorOpts,
    alphaNumValidator,
} from "./AlphaNumValidator";

describe("alphaNumValidator", () => {
    const ctx: ValidationContext = {
        form: {} as any,
        selector: "test",
        value: "",
    };

    const tests: {
        name: string;
        alphaNum: AlphaNumValidatorOpts;
        value: any;
        expected: boolean;
        error?: string;
    }[] = [
        {
            name: "should validate alphanumeric string with default options",
            alphaNum: {},
            value: "abc123",
            expected: true,
        },
        {
            name: "should validate alpha-only string",
            alphaNum: {},
            value: "abc",
            expected: true,
        },
        {
            name: "should validate numeric-only string",
            alphaNum: {},
            value: "123",
            expected: true,
        },
        {
            name: "should not validate string with special characters",
            alphaNum: {},
            value: "abc123!@#",
            expected: false,
        },
        {
            name: "should not validate string with spaces by default",
            alphaNum: {},
            value: "abc 123",
            expected: false,
            error: alphaNumValidator.err.InvalidChar,
        },
        {
            name: "should validate string with spaces when space option is true",
            alphaNum: {
                spaces: true,
            },
            value: "abc 123",
            expected: true,
        },
        {
            name: "should not validate non-string values",
            alphaNum: {},
            value: 123,
            expected: false,
            error: alphaNumValidator.err.InvalidType,
        },
    ];

    tests.forEach(test => {
        it(test.name, () => {
            ctx.value = test.value;
            const alphaNum: AlphaNumValidatorOpts = test.alphaNum;
            const validator = new AlphaNumValidator(
                ctx.selector,
                "validation",
                alphaNum,
            );
            const [isValid, errorCode] = validator.validate(ctx);
            expect(isValid).toBe(test.expected);
            if (!isValid && test.error) {
                expect(errorCode).toBe(test.error);
            }
        });
    });
});
