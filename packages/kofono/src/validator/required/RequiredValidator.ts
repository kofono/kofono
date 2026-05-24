import { isEmptyString, optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import { isInEnum } from "../isInEnum/isInEnum";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type SchemaRequiredValidator =
    | "required"
    | { required: RequiredValidatorOpts };

export type RequiredValidatorOpts = SchemaPropertyBaseValidator;

export const requiredValidator = {
    name: "required" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: RequiredValidatorOpts,
    ) => new RequiredValidator(selector, type, opts),
    err: {
        IsRequired: "_REQUIRED_IS_REQUIRED",
    },
};

export function required(expect?: string): SchemaRequiredValidator {
    return {
        required: {
            ...optional("error", expect),
        },
    };
}

export class RequiredValidator extends AbstractValidator implements Validator {
    validate(ctx: ValidationContext): ValidatorResponse {
        if ([undefined, null].includes(ctx.value)) {
            return this._error;
        }

        const valueType = typeof ctx.value;

        // todo early return of success by type ?
        if (valueType === "string" && isEmptyString(ctx.value)) {
            return this._error;
        } else if (valueType === "boolean" && ctx.value === false) {
            return this._error;
        } else if (Array.isArray(ctx.value) && ctx.value.length < 1) {
            return this._error;
        }

        if (ctx.form.prop(this.attachTo).has("enum") && !isInEnum(ctx)) {
            return this._error;
        }

        return this.success();
    }

    private get _error() {
        return this.error(requiredValidator.err.IsRequired);
    }
}
