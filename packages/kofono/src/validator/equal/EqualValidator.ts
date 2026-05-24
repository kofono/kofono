import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type EqualValidatorOpts = SchemaPropertyBaseValidator & {
    value: string | number | boolean | null;
    caseSensitive?: boolean;
};

export interface SchemaEqualValidator {
    equal: EqualValidatorOpts;
}

export const equalValidator = {
    name: "equal" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: EqualValidatorOpts,
    ) => new EqualValidator(selector, type, opts),
    err: {
        IsNotEqual: "_EQUAL_IS_NOT_EQUAL",
    },
};

export function equal(
    value: EqualValidatorOpts["value"],
    opts?: Pick<EqualValidatorOpts, "caseSensitive">,
    expect?: string,
) {
    return {
        equal: {
            value,
            ...opts,
            ...optional("error", expect),
        },
    };
}

export class EqualValidator extends AbstractValidator implements Validator {
    protected readonly expectedValue: string | number | boolean | null;
    protected readonly caseSensitive: boolean = true;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: EqualValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.expectedValue = opts.value;
        if (opts.caseSensitive !== undefined) {
            this.caseSensitive = opts.caseSensitive;
            if (!this.caseSensitive) {
                this.expectedValue = String(this.expectedValue).toLowerCase();
            }
        }
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        if (typeof ctx.value === "string" && !this.caseSensitive) {
            ctx.value = ctx.value.toLowerCase();
        }
        if (ctx.value === this.expectedValue) {
            return this.success();
        }
        return this.error(equalValidator.err.IsNotEqual);
    }
}
