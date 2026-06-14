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

export interface SchemaExpressionValidator {
    expression: ExpressionValidatorOpts;
}

export type ExpressionValidatorOpts =
    | Condition
    | (SchemaPropertyBaseValidator & {
          condition: Condition;
      });

export const expressionValidator = {
    name: "expression" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: ExpressionValidatorOpts,
    ) => new ExpressionValidator(selector, type, opts),
    err: {
        IsFailing: "_CONDITION_IS_FAILING",
    },
};

export function expression(
    condition: Condition,
    expect?: string,
): SchemaExpressionValidator {
    return {
        expression: {
            condition,
            ...optional("error", expect),
        },
    };
}

export class ExpressionValidator
    extends AbstractValidator<ExpressionValidatorOpts>
    implements Validator
{
    private readonly placeholders: PlaceholderList;
    private readonly condition: Condition;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: ExpressionValidatorOpts,
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

        return this.error(expressionValidator.err.IsFailing);
    }
}
