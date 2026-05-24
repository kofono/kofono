import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type SchemaIsTrueValidator = "isTrue" | { isTrue: IsTrueValidatorOpts };

export type IsTrueValidatorOpts = SchemaPropertyBaseValidator;

export const isTrueValidator = {
    name: "isTrue" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: IsTrueValidatorOpts,
    ) => new IsTrueValidator(selector, type, opts),
    err: {
        IsNotTrue: "_IS_TRUE_IS_NOT_TRUE",
    },
};

export function isTrue(expect?: string): SchemaIsTrueValidator {
    return {
        isTrue: {
            ...optional("error", expect),
        },
    };
}

export class IsTrueValidator extends AbstractValidator implements Validator {
    validate(ctx: ValidationContext): ValidatorResponse {
        if (ctx.value === true) {
            return this.success();
        }
        return this.error(isTrueValidator.err.IsNotTrue);
    }
}
