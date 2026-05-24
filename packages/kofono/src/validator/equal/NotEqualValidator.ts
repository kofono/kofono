import { optional } from "../../common/helpers";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    ValidatorResponse,
} from "../types";
import { EqualValidator } from "./EqualValidator";

export type NotEqualValidatorOpts = SchemaPropertyBaseValidator & {
    value: string | number | boolean | null;
    caseSensitive?: boolean;
};

export interface SchemaNotEqualValidator {
    notEqual: NotEqualValidatorOpts;
}

export const notEqualValidator = {
    name: "notEqual" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: NotEqualValidatorOpts,
    ) => new NotEqualValidator(selector, type, opts),
    err: {
        IsEqual: "_NOT_EQUAL_IS_EQUAL",
    },
};

export function notEqual(
    value: NotEqualValidatorOpts["value"],
    opts?: Pick<NotEqualValidatorOpts, "caseSensitive">,
    expect?: string,
) {
    return {
        notEqual: {
            value,
            ...opts,
            ...optional("error", expect),
        },
    };
}

export class NotEqualValidator extends EqualValidator {
    validate(ctx: ValidationContext): ValidatorResponse {
        if (typeof ctx.value === "string" && !this.caseSensitive) {
            ctx.value = ctx.value.toLowerCase();
        }

        if (ctx.value !== this.expectedValue) {
            return this.success();
        }
        return this.error(notEqualValidator.err.IsEqual);
    }
}
