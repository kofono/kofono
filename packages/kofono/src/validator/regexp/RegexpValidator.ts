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

type Flag = "d" | "g" | "i" | "m" | "s" | "u" | "v" | "y";
type NoRepeat<T extends string, U extends string = T> =
    | (U extends any ? `${U}${NoRepeat<Exclude<T, U>>}` : never)
    | "";

export type FlagCombinations = NoRepeat<Flag>;

export type RegexValidatorOpts =
    | string
    | (SchemaPropertyBaseValidator & {
          pattern: string;
          //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#advanced_searching_with_flags
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
        InvalidType: "_REGEXP_INVALID_TYPE",
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
        if (typeof ctx.value !== "string") {
            return this.error(regexpValidator.err.InvalidType);
        }

        if (this.pattern.test(ctx.value)) {
            return this.success();
        }
        return this.error(regexpValidator.err.NotMatching);
    }
}
