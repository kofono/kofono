import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface NotSameAsValidatorOpts extends SchemaPropertyBaseValidator {
    selector: string;
}

export interface SchemaNotSameAsValidator {
    notSameAs: NotSameAsValidatorOpts;
}

export const notSameAsValidator = {
    name: "notSameAs" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: NotSameAsValidatorOpts,
    ) => new NotSameAsValidator(selector, type, opts),
    err: {
        Match: "_NOT_SAME_AS_MATCH",
    },
    support: [
        // all types
    ],
};

export function notSameAs(
    selector: string,
    expect?: string,
): SchemaNotSameAsValidator {
    return {
        notSameAs: {
            selector,
            ...optional("error", expect),
        },
    };
}

export class NotSameAsValidator
    extends AbstractValidator<NotSameAsValidatorOpts>
    implements Validator
{
    private readonly otherSelector: string;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: NotSameAsValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.otherSelector = opts.selector;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        const otherValue = ctx.form.$d(this.otherSelector);
        return ctx.value !== otherValue
            ? this.success()
            : this.error(notSameAsValidator.err.Match);
    }
}
