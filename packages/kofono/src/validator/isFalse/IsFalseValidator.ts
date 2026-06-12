import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type SchemaIsFalseValidator =
    | "isFalse"
    | { isFalse: IsFalseValidatorOpts };

export interface IsFalseValidatorOpts extends SchemaPropertyBaseValidator {}

export const isFalseValidator = {
    name: "isFalse" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: IsFalseValidatorOpts,
    ) => new IsFalseValidator(selector, type, opts),
    err: {
        IsNotFalse: "_IS_FALSE_IS_NOT_FALSE",
    },
};

export function isFalse(expect?: string): SchemaIsFalseValidator {
    return {
        isFalse: {
            ...optional("error", expect),
        },
    };
}

export class IsFalseValidator extends AbstractValidator implements Validator {
    validate(ctx: ValidationContext): ValidatorResponse {
        if (ctx.value === false) {
            return this.success();
        }
        return this.error(isFalseValidator.err.IsNotFalse);
    }
}
