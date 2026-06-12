import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface SchemaBetweenValidator {
    between: BetweenValidatorOpts;
}

export interface BetweenValidatorOpts extends SchemaPropertyBaseValidator {
    min: number;
    max: number;
}

export const betweenValidator = {
    name: "between",
    factory: (
        selector: string,
        type: ValidationType,
        opts: BetweenValidatorOpts,
    ) => new BetweenValidator(selector, type, opts),
    err: {
        InvalidType: "_BETWEEN_INVALID_TYPE",
        BelowLengthMin: "_BETWEEN_BELOW_LENGTH_MIN",
        AboveLengthMax: "_BETWEEN_ABOVE_LENGTH_MAX",
        BelowMin: "_BETWEEN_BELOW_MIN",
        AboveMax: "_BETWEEN_ABOVE_MAX",
    },
};

export function between(
    min: number,
    max: number,
    expect?: string,
): SchemaBetweenValidator {
    return {
        between: {
            min,
            max,
            ...optional("error", expect),
        },
    };
}

// BetweenValidator is a validator that checks if a value is between two numbers
// Support value of type string, number and array
export class BetweenValidator
    extends AbstractValidator<BetweenValidatorOpts>
    implements Validator
{
    private readonly min: number;
    private readonly max: number;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: BetweenValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.min = opts.min;
        this.max = opts.max;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        const type = typeof ctx.value;
        if (type === "string" || Array.isArray(ctx.value)) {
            if (ctx.value.length < this.min) {
                return this.error(betweenValidator.err.BelowLengthMin, {
                    min: this.min,
                });
            }
            if (ctx.value.length > this.max) {
                return this.error(betweenValidator.err.AboveLengthMax, {
                    max: this.max,
                });
            }
            return this.success();
        }

        if (typeof ctx.value !== "number") {
            return this.error(betweenValidator.err.InvalidType);
        }
        if (ctx.value < this.min) {
            return this.error(betweenValidator.err.BelowMin, {
                min: this.min,
            });
        }
        if (ctx.value > this.max) {
            return this.error(betweenValidator.err.AboveMax, {
                max: this.max,
            });
        }

        return this.success();
    }
}
