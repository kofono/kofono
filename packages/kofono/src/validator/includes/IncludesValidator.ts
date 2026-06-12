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

export interface IncludesValidatorOpts extends SchemaPropertyBaseValidator {
    value: string | string[];
}

export interface SchemaIncludesValidator {
    includes: IncludesValidatorOpts;
}

export const includesValidator = {
    name: "includes" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: IncludesValidatorOpts,
    ) => new IncludesValidator(selector, type, opts),
    err: {
        NotIncludes: "_INCLUDES_NOT_INCLUDES",
    },
    support: [
        PropertyType.String,
        PropertyType.ListBoolean,
        PropertyType.ListNumber,
        PropertyType.ListMixed,
        PropertyType.ListString,
    ],
};

export function includes(
    value: IncludesValidatorOpts["value"],
    expect?: string,
): SchemaIncludesValidator {
    return {
        includes: {
            value,
            ...optional("error", expect),
        },
    };
}

function safeIncludes(value: any, search: any): boolean {
    if (!value?.includes) {
        return false;
    }
    return !!value.includes(search);
}

export class IncludesValidator
    extends AbstractValidator<IncludesValidatorOpts>
    implements Validator
{
    private readonly value: IncludesValidatorOpts["value"];
    constructor(
        attachTo: string,
        type: ValidationType,
        opts: IncludesValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.value = opts.value;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        return safeIncludes(ctx.value, this.value)
            ? this.success()
            : this.error(includesValidator.err.NotIncludes);
    }
}
