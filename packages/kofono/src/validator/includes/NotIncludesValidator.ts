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

export interface NotIncludesValidatorOpts extends SchemaPropertyBaseValidator {
    value: string | string[];
}

export interface SchemaNotIncludesValidator {
    notIncludes: NotIncludesValidatorOpts;
}

export const notIncludesValidator = {
    name: "notIncludes" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: NotIncludesValidatorOpts,
    ) => new NotIncludesValidator(selector, type, opts),
    err: {
        Includes: "_NOT_INCLUDES_INCLUDES",
    },
    support: [
        PropertyType.String,
        PropertyType.ListBoolean,
        PropertyType.ListNumber,
        PropertyType.ListMixed,
        PropertyType.ListString,
    ],
};

export function notIncludes(
    value: NotIncludesValidatorOpts["value"],
    expect?: string,
): SchemaNotIncludesValidator {
    return {
        notIncludes: {
            value,
            ...optional("error", expect),
        },
    };
}

function safeNotIncludes(value: any, search: any): boolean {
    if (!value?.includes) {
        return true;
    }
    return !value.includes(search);
}

export class NotIncludesValidator
    extends AbstractValidator<NotIncludesValidatorOpts>
    implements Validator
{
    private readonly value: NotIncludesValidatorOpts["value"];

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: NotIncludesValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.value = opts.value;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        return safeNotIncludes(ctx.value, this.value)
            ? this.success()
            : this.error(notIncludesValidator.err.Includes);
    }
}
