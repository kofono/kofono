import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface SchemaRegexpValidator {
    regexp: RegexValidatorOpts;
}

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags
type Flag = "d" | "g" | "i" | "m" | "s" | "u" | "v" | "y";
type NoRepeat<T extends string, U extends string = T> =
    | (U extends any ? `${U}${NoRepeat<Exclude<T, U>>}` : never)
    | "";

export type FlagCombinations = NoRepeat<Flag>;

export type RegexValidatorOpts =
    | string
    | (SchemaPropertyBaseValidator & {
          pattern: string;
          flags?: FlagCombinations;
      });

export const regexpValidator = {
    name: "regexp" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: RegexValidatorOpts,
    ) => new RegexpValidator(selector, type, opts),
    err: {
        NotMatching: "_REGEXP_NOT_MATCHING",
    },
};

export function regexp(
    pattern: string,
    opts?: { flags?: FlagCombinations },
    expect?: string,
): SchemaRegexpValidator {
    return {
        regexp: {
            pattern,
            ...opts,
            ...optional("error", expect),
        },
    };
}

export class RegexpValidator
    extends AbstractValidator<RegexValidatorOpts>
    implements Validator
{
    protected readonly pattern: RegExp;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: RegexValidatorOpts,
    ) {
        super(attachTo, type, opts);
        this.pattern =
            typeof opts === "string"
                ? new RegExp(opts)
                : new RegExp(opts.pattern, opts.flags);
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        if (Array.isArray(ctx.value)) {
            for (const val of ctx.value) {
                this.pattern.lastIndex = 0;
                if (!this.pattern.test(val)) {
                    return this.error(regexpValidator.err.NotMatching);
                }
            }
            return this.success();
        }

        this.pattern.lastIndex = 0;
        if (this.pattern.test(ctx.value)) {
            return this.success();
        }

        return this.error(regexpValidator.err.NotMatching);
    }
}
