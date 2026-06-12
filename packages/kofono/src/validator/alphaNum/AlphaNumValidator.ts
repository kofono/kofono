import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type SchemaAlphaNumValidator =
    | "alphaNum"
    | { alphaNum: AlphaNumValidatorOpts };

export interface AlphaNumValidatorOpts extends SchemaPropertyBaseValidator {
    spaces?: boolean;
}

export const alphaNumValidator = {
    name: "alphaNum" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: AlphaNumValidatorOpts,
    ) => new AlphaNumValidator(selector, type, opts),
    err: {
        InvalidType: "_ALPHA_NUM_INVALID_TYPE",
        InvalidChar: "_ALPHA_NUM_INVALID_CHAR",
    },
};

export function alphaNum(
    opts: AlphaNumValidatorOpts,
    expect?: string,
): SchemaAlphaNumValidator {
    return {
        alphaNum: {
            ...opts,
            ...optional("error", expect),
        },
    };
}

export class AlphaNumValidator
    extends AbstractValidator<AlphaNumValidatorOpts>
    implements Validator
{
    private readonly allowSpaces: boolean;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: AlphaNumValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.allowSpaces = opts.spaces || false;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        if (typeof ctx.value !== "string") {
            return this.error(alphaNumValidator.err.InvalidType);
        }

        const pattern = this.allowSpaces
            ? /^[A-Za-z0-9\s]+$/
            : /^[A-Za-z0-9]+$/;

        if (pattern.test(ctx.value)) {
            return this.success();
        }
        return this.error(alphaNumValidator.err.InvalidChar);
    }
}
