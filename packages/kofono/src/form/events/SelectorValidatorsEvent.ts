import type { PropertyValidator } from "../../property/types";
import type {
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../../validator/types";
import type { Form } from "../Form";

/**
 * Create selector validators instances and generate a callback event for a selector
 */
export class SelectorValidatorsEvent {
    private validators: Validator[] = [];
    public readonly dependencies: string[] = [];

    constructor(
        private type: ValidationType,
        private form: Form,
        private readonly selector: string,
        private validations: PropertyValidator[],
    ) {
        this.prepareValidators();
        this.dependencies = this.getDependencies();
    }

    /**
     * Generate a callback event that wraps all validators
     */
    generateEvent(): () => Promise<ValidatorResponse> {
        return async (): Promise<ValidatorResponse> => {
            const value = this.form.$d(this.selector);

            for (const validator of this.validators) {
                const [isValid, message, context] = await validator.validate({
                    selector: this.selector,
                    value: structuredClone(value),
                    form: this.form,
                });

                if (!isValid) {
                    return !context
                        ? [false, message]
                        : [false, message, context];
                }
            }
            return [true, ""];
        };
    }

    /**
     * Transform selector validators definition into validators instances
     */
    private prepareValidators() {
        for (const validator of this.validations) {
            if (!this.form.validatorsFactory.has(validator.name)) {
                throw new Error(`Validator ${validator.name} not found`);
            }

            this.validators.push(
                this.form.validatorsFactory.get(validator.name)(
                    this.selector,
                    this.type,
                    validator.options,
                ),
            );
        }
    }

    /**
     * Get all dependencies of from all validator's instances
     */
    private getDependencies(): string[] {
        const deps: Set<string> = new Set();
        for (const v of this.validators) {
            const vDeps = v.dependencies();
            for (const dep of vDeps) {
                deps.add(dep);
            }
        }

        return Array.from(deps);
    }
}
