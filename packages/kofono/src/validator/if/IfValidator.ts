import { parseValidators } from "../../property/parser";
import type { PropertyValidator } from "../../property/types";
import {
    evaluateCondition,
    parseConditionPlaceholders,
    placeholdersListToSelectors,
} from "../_condition/condition";
import type { Condition, PlaceholderList } from "../_condition/types";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface SchemaIfValidator {
    if: IfValidatorOpts;
}

export interface IfValidatorOpts {
    condition: Condition;
    then: SchemaPropertyValidator[];
}

export const ifValidator = {
    name: "if" as const,
    factory: (selector: string, type: ValidationType, opts: IfValidatorOpts) =>
        new IfValidator(selector, type, opts),
};

export class IfValidator
    extends AbstractValidator<IfValidatorOpts>
    implements Validator
{
    private readonly placeholders: PlaceholderList;
    private readonly condition: Condition;
    private readonly propertyValidators: PropertyValidator[];
    private validators: Validator[] = [];
    private hasBuiltValidators: boolean = false;

    constructor(attachTo: string, type: ValidationType, opts: IfValidatorOpts) {
        super(attachTo, type, opts);
        this.condition = opts.condition;
        this.placeholders = parseConditionPlaceholders(opts.condition, {});
        this.propertyValidators = parseValidators(opts.then);
        this.addDependencies(placeholdersListToSelectors(this.placeholders));
    }

    async validate(ctx: ValidationContext): Promise<ValidatorResponse> {
        if (evaluateCondition(this.condition, ctx, this.placeholders)) {
            this.buildValidators(ctx);

            for (const validator of this.validators) {
                const result = await validator.validate(ctx);
                if (result[0] === false) {
                    return result;
                }
            }
        }
        return this.success();
    }

    // this should be called only once because it can be expensive
    private buildValidators(ctx: ValidationContext) {
        if (this.hasBuiltValidators) {
            return;
        }

        const deps: string[] = [];

        for (const validator of this.propertyValidators) {
            const valInstance = ctx.form.validatorsFactory.get(validator.name)(
                this.attachTo,
                this.type,
                validator.options,
            );
            deps.push(...valInstance.dependencies());
            this.validators.push(valInstance);
        }

        this.hasBuiltValidators = true;
        ctx.form.events.attachDependenciesTo(this.attachTo, deps);
    }
}
