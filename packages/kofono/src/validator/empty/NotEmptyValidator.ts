import { isEmptyString, optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type SchemaNotEmptyValidator =
    | "notEmpty"
    | { notEmpty: NotEmptyValidatorOpts };

export type NotEmptyValidatorOpts = SchemaPropertyBaseValidator;

export const notEmptyValidator = {
    name: "notEmpty" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: NotEmptyValidatorOpts,
    ) => new NotEmptyValidator(selector, type, opts),
    err: {
        IsEmpty: "_NOT_EMPTY_IS_EMPTY",
    },
};

export function notEmpty(expect?: string): SchemaNotEmptyValidator {
    return {
        notEmpty: {
            ...optional("error", expect),
        },
    };
}

export class NotEmptyValidator extends AbstractValidator implements Validator {
    validate(ctx: ValidationContext): ValidatorResponse {
        if (!ctx.value) {
            return this.error(notEmptyValidator.err.IsEmpty);
        } else if (typeof ctx.value !== "string") {
            ctx.value = String(ctx.value);
        }

        if (isEmptyString(ctx.value)) {
            return this.error(notEmptyValidator.err.IsEmpty);
        }
        return this.success();
    }
}
