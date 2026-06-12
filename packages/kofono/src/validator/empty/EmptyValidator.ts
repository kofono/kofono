import { isEmptyString, optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type SchemaEmptyValidator = "empty" | { empty: EmptyValidatorOpts };

export interface EmptyValidatorOpts extends SchemaPropertyBaseValidator {}

export const emptyValidator = {
    name: "empty" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: EmptyValidatorOpts,
    ) => new EmptyValidator(selector, type, opts),
    err: {
        IsNotEmpty: "_EMPTY_IS_NOT_EMPTY",
    },
};

export function empty(expect?: string): SchemaEmptyValidator {
    return {
        empty: {
            ...optional("error", expect),
        },
    };
}

export class EmptyValidator extends AbstractValidator implements Validator {
    validate(ctx: ValidationContext): ValidatorResponse {
        if (!ctx.value) {
            return this.success();
        } else if (typeof ctx.value !== "string") {
            ctx.value = String(ctx.value);
        }

        if (isEmptyString(ctx.value)) {
            return this.success();
        }
        return this.error(emptyValidator.err.IsNotEmpty);
    }
}
