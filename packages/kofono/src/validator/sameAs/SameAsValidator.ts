import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface SameAsValidatorOpts extends SchemaPropertyBaseValidator {
    selector: string;
}

export interface SchemaSameAsValidator {
    sameAs: SameAsValidatorOpts;
}

export const sameAsValidator = {
    name: "sameAs" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: SameAsValidatorOpts,
    ) => new SameAsValidator(selector, type, opts),
    err: {
        NotMatch: "_SAME_AS_NOT_MATCH",
    },
    support: [
        //all types
    ],
};

export function sameAs(
    selector: string,
    expect?: string,
): SchemaSameAsValidator {
    return {
        sameAs: {
            selector,
            ...optional("error", expect),
        },
    };
}

export class SameAsValidator
    extends AbstractValidator<SameAsValidatorOpts>
    implements Validator
{
    private readonly otherSelector: string;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: SameAsValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.otherSelector = opts.selector;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        const otherValue = ctx.form.$d(this.otherSelector);
        return ctx.value === otherValue
            ? this.success()
            : this.error(sameAsValidator.err.NotMatch);
    }
}
