import { describe, expect, it } from "vitest";
import type { ValidationContext } from "../types";
import {
    AlphaValidator,
    type AlphaValidatorOpts,
    alphaValidator,
} from "./AlphaValidator";

describe("alphaValidator", () => {
    const ctx: ValidationContext = {
        form: {} as any,
        selector: "test",
        value: "",
    };

    const tests: {
        name: string;
        alpha: AlphaValidatorOpts;
        value: any;
        expected: boolean;
        error?: string;
    }[] = [
        {
            name: "should validate alpha string with default options",
            alpha: {},
            value: "abc",
            expected: true,
        },
        {
            name: "should not validate string with numbers",
            alpha: {},
            value: "abc123",
            expected: false,
        },
        {
            name: "should not validate string with special characters",
            alpha: {},
            value: "abc!@#",
            expected: false,
        },
        {
            name: "should not validate string with spaces by default",
            alpha: {},
            value: "abc def",
            expected: false,
            error: alphaValidator.err.InvalidChar,
        },
        {
            name: "should validate string with spaces when space option is true",
            alpha: {
                spaces: true,
            },
            value: "abc def test",
            expected: true,
        },
        {
            name: "should not validate non-string values",
            alpha: {},
            value: 123,
            expected: false,
            error: alphaValidator.err.InvalidType,
        },
    ];

    tests.forEach(test => {
        it(test.name, () => {
            ctx.value = test.value;
            const alpha: AlphaValidatorOpts = test.alpha;
            const validator = new AlphaValidator(
                ctx.selector,
                "validation",
                alpha,
            );
            const [isValid, errorCode] = validator.validate(ctx);
            expect(isValid).toBe(test.expected);
            if (test.error) {
                expect(errorCode).toBe(test.error);
            }
        });
    });
});
