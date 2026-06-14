import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";
import {
    evaluateCondition,
    parseConditionPlaceholders,
    placeholdersListToSelectors,
} from "./condition";
import type { Condition, PlaceholderList } from "./types";

export interface SchemaConditionValidator {
    condition: ConditionValidatorOpts;
}

export type ConditionValidatorOpts =
    | Condition
    | (SchemaPropertyBaseValidator & {
          condition: Condition;
      });

export const conditionValidator = {
    name: "condition" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: ConditionValidatorOpts,
    ) => new ConditionValidator(selector, type, opts),
    err: {
        IsFailing: "_CONDITION_IS_FAILING",
    },
};

export function condition(
    condition: Condition,
    expect?: string,
): SchemaConditionValidator {
    return {
        condition: {
            condition,
            ...optional("error", expect),
        },
    };
}

export class ConditionValidator
    extends AbstractValidator<ConditionValidatorOpts>
    implements Validator
{
    private readonly placeholders: PlaceholderList;
    private readonly condition: Condition;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: ConditionValidatorOpts,
    ) {
        super(attachTo, type, opts);

        this.condition = Array.isArray(opts)
            ? (opts as Condition)
            : opts.condition;

        this.placeholders = parseConditionPlaceholders(this.condition, {});
        this.addDependencies(placeholdersListToSelectors(this.placeholders));
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        if (evaluateCondition(this.condition, ctx, this.placeholders)) {
            return this.success();
        }

        return this.error(conditionValidator.err.IsFailing);
    }
}
