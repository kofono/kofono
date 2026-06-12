import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type SameAsValidatorOpts = SchemaPropertyBaseValidator & {
    value: string;
};

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

export function sameAs(value: string, expect?: string) {
    return {
        sameAs: {
            value,
            ...optional("error", expect),
        },
    };
}

export class SameAsValidator extends AbstractValidator implements Validator {
    private readonly otherSelector: string;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: SameAsValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.otherSelector = opts.value;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        const otherValue = ctx.form.$d(this.otherSelector);
        return ctx.value === otherValue
            ? this.success()
            : this.error(sameAsValidator.err.NotMatch);
    }
}
