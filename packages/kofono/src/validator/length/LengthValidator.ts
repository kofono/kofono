import { optional } from "../../common/helpers";
import { PropertyType } from "../../property/types";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface LengthValidatorOpts extends SchemaPropertyBaseValidator {
    value: number;
}

export interface SchemaLengthValidator {
    length: LengthValidatorOpts;
}

export const lengthValidator = {
    name: "length" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: LengthValidatorOpts,
    ) => new LengthValidator(selector, type, opts),
    err: {
        NotMatch: "_LENGTH_NOT_MATCH",
        InvalidType: "_LENGTH_INVALID_TYPE",
    },
    support: [
        PropertyType.String,
        PropertyType.ListBigInt,
        PropertyType.ListBoolean,
        PropertyType.ListMixed,
        PropertyType.ListNumber,
        PropertyType.ListString,
    ],
};

export function length(value: number, expect?: string): SchemaLengthValidator {
    return {
        length: {
            value,
            ...optional("error", expect),
        },
    };
}

export class LengthValidator
    extends AbstractValidator<LengthValidatorOpts>
    implements Validator
{
    private readonly value: number;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: LengthValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.value = opts.value;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        if (typeof ctx.value === "string" || Array.isArray(ctx.value)) {
            return ctx.value.length === this.value
                ? this.success()
                : this.error(lengthValidator.err.NotMatch);
        }
        return this.error(lengthValidator.err.InvalidType);
    }
}
