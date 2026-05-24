import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface SchemaMaxValidator {
    max: MaxValidatorOpts;
}

export type MaxValidatorOpts =
    | number
    | (SchemaPropertyBaseValidator & {
          value: number;
      });

export const maxValidator = {
    name: "max" as const,
    factory: (selector: string, type: ValidationType, opts: MaxValidatorOpts) =>
        new MaxValidator(selector, type, opts),
    err: {
        InvalidType: "_MAX_INVALID_TYPE",
        AboveMax: "_MAX_ABOVE_MAX",
    },
};

export function max(max: number, expect?: string): SchemaMaxValidator {
    return {
        max: {
            value: max,
            ...optional("error", expect),
        },
    };
}

export class MaxValidator
    extends AbstractValidator<MaxValidatorOpts>
    implements Validator
{
    private readonly max: number;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: MaxValidatorOpts,
    ) {
        super(attachTo, type, opts);

        // todo should throw error if not an object (OptionsError)
        this.max = typeof opts === "number" ? opts : opts.value;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        const type = typeof ctx.value;
        if (type === "number") {
            if (ctx.value > this.max) {
                return this.error(maxValidator.err.AboveMax, {
                    max: this.max,
                });
            }
            return this.success();
        } else if (type === "string" || Array.isArray(ctx.value)) {
            if (ctx.value.length > this.max) {
                return this.error(maxValidator.err.AboveMax, {
                    max: this.max,
                });
            }
            return this.success();
        }
        return this.error(maxValidator.err.InvalidType);
    }
}
