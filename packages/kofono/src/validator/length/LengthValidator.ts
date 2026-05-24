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

export type LengthValidatorOpts = SchemaPropertyBaseValidator & {
    value: number;
};

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
    },
    support: [
        PropertyType.String,
        PropertyType.ListBoolean,
        PropertyType.ListNumber,
        PropertyType.ListMixed,
        PropertyType.ListString,
    ],
};

export function length(value: number, expect?: string) {
    return {
        length: {
            value,
            ...optional("error", expect),
        },
    };
}
function safeLength(value: any, expectedLength: number): boolean {
    if (typeof value === "string" || Array.isArray(value)) {
        return value.length === expectedLength;
    }
    return false;
}

export class LengthValidator extends AbstractValidator implements Validator {
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
        return safeLength(ctx.value, this.value)
            ? this.success()
            : this.error(lengthValidator.err.NotMatch);
    }
}
