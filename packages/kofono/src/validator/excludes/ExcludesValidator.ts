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

export interface ExcludesValidatorOpts extends SchemaPropertyBaseValidator {
    value: string | string[];
}

export interface SchemaExcludesValidator {
    excludes: ExcludesValidatorOpts;
}

export const excludesValidator = {
    name: "excludes" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: ExcludesValidatorOpts,
    ) => new ExcludesValidator(selector, type, opts),
    err: {
        Includes: "_EXCLUDES_INCLUDES",
    },
    support: [
        PropertyType.String,
        PropertyType.ListBoolean,
        PropertyType.ListNumber,
        PropertyType.ListMixed,
        PropertyType.ListString,
    ],
};

export function excludes(
    value: ExcludesValidatorOpts["value"],
    expect?: string,
): SchemaExcludesValidator {
    return {
        excludes: {
            value,
            ...optional("error", expect),
        },
    };
}

function safeExcludes(value: any, search: any): boolean {
    if (!value?.includes) {
        return true;
    }
    return !value.includes(search);
}

export class ExcludesValidator
    extends AbstractValidator<ExcludesValidatorOpts>
    implements Validator
{
    private readonly value: ExcludesValidatorOpts["value"];

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: ExcludesValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.value = opts.value;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        return safeExcludes(ctx.value, this.value)
            ? this.success()
            : this.error(excludesValidator.err.Includes);
    }
}
