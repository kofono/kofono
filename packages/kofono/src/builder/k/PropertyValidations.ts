import { optional } from "../../common/helpers";
import type {
    Condition,
    ExpressionField,
    ExpressionValue,
    Operator,
} from "../../validator/_condition/types";
import type { AlphaValidatorOpts } from "../../validator/alpha/AlphaValidator";
import type { AlphaNumValidatorOpts } from "../../validator/alphaNum/AlphaNumValidator";
import type { EqualValidatorOpts } from "../../validator/equal/EqualValidator";
import type { IfValidatorOpts } from "../../validator/if/IfValidator";
import type { PasswordValidatorOpts } from "../../validator/password/PasswordValidator";
import type { FlagCombinations } from "../../validator/regexp/RegexpValidator";
import type { SchemaPropertyValidator } from "../../validator/schema";
import type { UrlValidatorOpts } from "../../validator/url/UrlValidator";

// todo: deprecated
// reason: add extra mappings of validators, so its fragile and drift often
export class PropertyValidations {
    #def: SchemaPropertyValidator[] = [];

    constructor(def: SchemaPropertyValidator[] = []) {
        this.#def = def;
    }

    public get def(): SchemaPropertyValidator[] {
        return this.#def;
    }

    // internal: Add a validation to the list
    private addValidator(
        validation: SchemaPropertyValidator,
    ): PropertyValidations {
        this.#def.push(validation);
        return this;
    }

    // Special case for adding a custom error message to the last validation
    public expect(error: string): PropertyValidations {
        if (this.def.length === 0) {
            throw new Error("No validations defined");
        }

        const lastIndex = this.def.length - 1;
        const defType = typeof this.def[lastIndex];

        // if def is string, it means we have to convert it to an object
        if (defType === "string") {
            const key: SchemaPropertyValidator = this.def[lastIndex];
            this.def[lastIndex] = {
                [key as string]: {
                    error,
                },
            } as unknown as SchemaPropertyValidator;
            return this;
        }

        // if def is object, we have to add the error to the last object
        if (defType === "object") {
            const key = Object.keys(this.def[lastIndex])[0];
            this.def[lastIndex][key] = {
                ...this.def[lastIndex][key],
                error,
            };
            return this;
        }

        return this;
    }

    // BetweenValidator
    public between(min: number, max: number): PropertyValidations {
        return this.addValidator({
            between: {
                min,
                max,
            },
        });
    }

    // DatetimeValidator
    public datetime(
        format: string,
        min?: string,
        max?: string,
    ): PropertyValidations {
        return this.addValidator({
            datetime: {
                format,
                ...optional("min", min),
                ...optional("max", max),
            },
        });
    }

    // EmailValidator
    public email(): PropertyValidations {
        return this.addValidator("email");
    }

    // EqualValidator
    public equal(
        value: EqualValidatorOpts["value"],
        caseSensitive?: EqualValidatorOpts["caseSensitive"],
    ): PropertyValidations {
        return this.addValidator({
            equal: {
                value,
                ...optional("caseSensitive", caseSensitive),
            },
        });
    }

    // IfValidator
    public if(
        condition: Condition,
        then: IfValidatorOpts["then"],
    ): PropertyValidations {
        return this.addValidator({
            if: {
                condition,
                then,
            },
        });
    }

    // ExpValidator
    public condition(
        field: ExpressionField,
        operator: Operator,
        value: ExpressionValue,
    ): PropertyValidations {
        return this.conditions([field, operator, value]);
    }

    public conditions(condition: Condition): PropertyValidations {
        return this.addValidator({
            condition: {
                condition,
            },
        });
    }

    // ValidValidator
    public isValid(selectors: string | string[]): PropertyValidations {
        return this.addValidator({
            isValid: {
                selectors,
            },
        });
    }

    // NotValidValidator
    public isNotValid(selectors: string | string[]): PropertyValidations {
        return this.addValidator({
            isNotValid: {
                selectors,
            },
        });
    }

    // MinValidator
    public min(value: number): PropertyValidations {
        return this.addValidator({
            min: {
                value,
            },
        });
    }

    // MaxValidator
    public max(value: number): PropertyValidations {
        return this.addValidator({
            max: {
                value,
            },
        });
    }

    // NotEmptyValidator
    public notEmpty(): PropertyValidations {
        return this.addValidator("notEmpty");
    }

    // NotEqualValidator
    public notEqual(
        value: EqualValidatorOpts["value"],
        caseSensitive?: EqualValidatorOpts["caseSensitive"],
    ): PropertyValidations {
        return this.addValidator({
            notEqual: {
                value,
                ...optional("caseSensitive", caseSensitive),
            },
        });
    }

    // PasswordValidator
    public password(opts: PasswordValidatorOpts): PropertyValidations {
        return this.addValidator({
            password: opts,
        });
    }

    // RegexpValidator
    public regexp(pattern: string, flags?: FlagCombinations) {
        return this.addValidator({
            regexp: {
                pattern,
                ...optional("flags", flags),
            },
        });
    }

    public required(): PropertyValidations {
        return this.addValidator("required");
    }

    // AlphaValidator
    public alpha(opts?: AlphaValidatorOpts): PropertyValidations {
        if (!opts) {
            return this.addValidator("alpha");
        }
        return this.addValidator({
            alpha: opts,
        });
    }

    // AlphaNumValidator
    public alphaNum(opts?: AlphaNumValidatorOpts): PropertyValidations {
        if (!opts) {
            return this.addValidator("alphaNum");
        }
        return this.addValidator({
            alphaNum: opts,
        });
    }

    // UrlValidator
    public url(opts?: UrlValidatorOpts): PropertyValidations {
        if (!opts) {
            return this.addValidator("url");
        }
        return this.addValidator({
            url: opts,
        });
    }
}
