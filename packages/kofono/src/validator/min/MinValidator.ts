import { objectHasKey, optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import { OptionsError } from "../OptionsError";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface SchemaMinValidator {
    min: MinValidatorOpts;
}

export type MinValidatorOpts =
    | number
    | (SchemaPropertyBaseValidator & {
          value: number;
      });

export const minValidator = {
    name: "min" as const,
    factory: (selector: string, type: ValidationType, opts: MinValidatorOpts) =>
        new MinValidator(selector, type, opts),
    err: {
        InvalidType: "_MIN_INVALID_TYPE",
        BelowMin: "_MIN_BELOW_MIN",
    },
};

export function min(min: number, expect?: string): SchemaMinValidator {
    return {
        min: {
            value: min,
            ...optional("error", expect),
        },
    };
}

export class MinValidator
    extends AbstractValidator<MinValidatorOpts>
    implements Validator
{
    private readonly min: number;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: MinValidatorOpts,
    ) {
        super(attachTo, type, opts);

        if (typeof opts === "number") {
            this.min = opts;
        } else if (typeof opts === "object" && objectHasKey(opts, "value")) {
            this.min = opts.value;
        } else {
            throw new OptionsError(this);
        }
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        const type = typeof ctx.value;
        if (type === "number") {
            if (ctx.value < this.min) {
                return this.error(minValidator.err.BelowMin, {
                    min: this.min,
                });
            }
            return this.success();
        } else if (type === "string" || Array.isArray(ctx.value)) {
            if (ctx.value.length < this.min) {
                return this.error(minValidator.err.BelowMin, {
                    min: this.min,
                });
            }
            return this.success();
        }
        return this.error(minValidator.err.InvalidType);
    }
}
