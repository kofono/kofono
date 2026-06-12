import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface SchemaPasswordValidator {
    password: PasswordValidatorOpts;
}

export interface PasswordValidatorOpts extends SchemaPropertyBaseValidator {
    min?: number;
    max?: number;
    lowerCase?: boolean;
    upperCase?: boolean;
    numbers?: boolean;
    specialChars?: boolean;
    specialCharsList?: string;
}

export const passwordValidator = {
    name: "password" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: PasswordValidatorOpts,
    ) => new PasswordValidator(selector, type, opts),
    err: {
        IsEmpty: "_PASSWORD_IS_EMPTY",
        MinLength: "_PASSWORD_MIN_LENGTH",
        MaxLength: "_PASSWORD_MAX_LENGTH",
        NoLowerCase: "_PASSWORD_NO_LOWER_CASE",
        UpperCase: "_PASSWORD_UPPER_CASE",
        Numbers: "_PASSWORD_NUMBERS",
        SpecialChars: "_PASSWORD_SPECIAL_CHARS",
    },
};
export function password(
    opts: PasswordValidatorOpts,
    expect?: string,
): SchemaPasswordValidator {
    return {
        password: opts,
        ...optional("error", expect),
    };
}

export class PasswordValidator
    extends AbstractValidator<PasswordValidatorOpts>
    implements Validator
{
    constructor(
        attachTo: string,
        type: ValidationType,
        public opts: PasswordValidatorOpts,
    ) {
        super(attachTo, type, opts);
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        if (!ctx.value) {
            return this.error(passwordValidator.err.IsEmpty);
        }

        if (
            typeof this.opts.min === "number" &&
            ctx.value.length < this.opts.min
        ) {
            return this.error(passwordValidator.err.MinLength, {
                min: this.opts.min,
            });
        }

        if (
            typeof this.opts.max === "number" &&
            ctx.value.length > this.opts.max
        ) {
            return this.error(passwordValidator.err.MaxLength, {
                max: this.opts.max,
            });
        }

        if (typeof this.opts.lowerCase === "boolean" && this.opts.lowerCase) {
            if (!/[a-z]/.test(ctx.value)) {
                return this.error(passwordValidator.err.NoLowerCase);
            }
        }

        if (typeof this.opts.upperCase === "boolean" && this.opts.upperCase) {
            if (!/[A-Z]/.test(ctx.value)) {
                return this.error(passwordValidator.err.UpperCase);
            }
        }

        if (typeof this.opts.numbers === "boolean" && this.opts.numbers) {
            if (!/[0-9]/.test(ctx.value)) {
                return this.error(passwordValidator.err.Numbers);
            }
        }

        if (
            typeof this.opts.specialChars === "boolean" &&
            this.opts.specialChars
        ) {
            const specialCharsList =
                this.opts.specialCharsList || "!@#$%^&*()_+";
            if (!new RegExp(`[${specialCharsList}]`).test(ctx.value)) {
                return this.error(passwordValidator.err.SpecialChars);
            }
        }

        return this.success();
    }
}
