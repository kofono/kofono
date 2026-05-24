import { optional } from "../../common/helpers";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    ValidatorResponse,
} from "../types";
import { IsValidValidator } from "./IsValidValidator";

export type IsNotValidValidatorOpts =
    | string
    | string[]
    | (SchemaPropertyBaseValidator & {
          selectors: string | string[];
      });

export interface SchemaIsNotValidValidator {
    isNotValid: IsNotValidValidatorOpts;
}

export const isNotValidValidator = {
    name: "isNotValid" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: IsNotValidValidatorOpts,
    ) => new IsNotValidValidator(selector, type, opts),
    err: {
        SelectorNotFound: "_IS_NOT_VALID_SELECTOR_NOT_FOUND",
        IsValid: "_IS_NOT_VALID_IS_VALID",
    },
};

export function isNotValid(
    selectors: string | string[],
    expect?: string,
): SchemaIsNotValidValidator {
    return {
        isNotValid: {
            selectors,
            ...optional("error", expect),
        },
    };
}

export class IsNotValidValidator extends IsValidValidator {
    validate(ctx: ValidationContext): ValidatorResponse {
        for (const selector of this.selectors) {
            if (!ctx.form.hasProp(selector)) {
                return this.error(isNotValidValidator.err.SelectorNotFound, {
                    selectors: this.selectors,
                });
            }
            // If any selector is valid, return an error
            if (
                ctx.form.prop(selector).isValid() &&
                ctx.form.prop(selector).isQualified()
            ) {
                return this.error(isNotValidValidator.err.IsValid, {
                    selectors: this.selectors,
                });
            }
        }
        // All selectors are not valid, return success
        return this.success();
    }
}
