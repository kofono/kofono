import { objectHasKey, optional } from "../../common/helpers";
import {
    getParentSelector,
    resolvePartialSelectors,
} from "../../selector/helpers";
import { AbstractValidator } from "../AbstractValidator";
import { OptionsError } from "../OptionsError";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export type IsValidValidatorOpts =
    | string
    | string[]
    | (SchemaPropertyBaseValidator & {
          selectors: string | string[];
      });

export interface SchemaIsValidValidator {
    isValid: IsValidValidatorOpts;
}

export const isValidValidator = {
    name: "isValid" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: IsValidValidatorOpts,
    ) => new IsValidValidator(selector, type, opts),
    err: {
        SelectorNotFound: "_IS_VALID_SELECTOR_NOT_FOUND",
        SelectorNotValid: "_IS_VALID_SELECTOR_NOT_VALID",
    },
};

export function isValid(
    selectors: string | string[],
    expect?: string,
): SchemaIsValidValidator {
    return {
        isValid: {
            selectors,
            ...optional("error", expect),
        },
    };
}

export class IsValidValidator
    extends AbstractValidator<IsValidValidatorOpts>
    implements Validator
{
    protected readonly selectors: string[] = [];

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: IsValidValidatorOpts,
    ) {
        super(attachTo, type, opts);

        if (typeof opts === "string") {
            this.selectors = [opts];
        } else if (Array.isArray(opts)) {
            this.selectors = opts;
        } else if (
            typeof opts === "object" &&
            objectHasKey(opts, "selectors")
        ) {
            this.selectors = !Array.isArray(opts.selectors)
                ? [opts.selectors]
                : opts.selectors;
        } else {
            throw new OptionsError(this);
        }

        const parentSelector = getParentSelector(this.attachTo);
        this.selectors = resolvePartialSelectors(
            parentSelector,
            this.selectors,
        );
        this.selDeps = this.selectors;
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        for (const selector of this.selectors) {
            if (!ctx.form.hasProp(selector)) {
                return this.error(isValidValidator.err.SelectorNotFound, {
                    selectors: this.selectors,
                });
            }
            if (
                !ctx.form.prop(selector).isValid() ||
                !ctx.form.prop(selector).isQualified()
            ) {
                return this.error(isValidValidator.err.SelectorNotValid, {
                    selectors: this.selectors,
                });
            }
        }
        return this.success();
    }
}
