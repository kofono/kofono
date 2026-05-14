import { isAfter, isEqual, isValid, parse } from "../../common/datetime";
import { optional } from "../../common/helpers";
import { AbstractValidator } from "../AbstractValidator";
import { ValidatorErrors } from "../errors";
import type { SchemaPropertyBaseValidator } from "../schema";
import type {
    ValidationContext,
    ValidationType,
    Validator,
    ValidatorResponse,
} from "../types";

export interface SchemaDatetimeValidator {
    datetime: DatetimeValidatorOpts;
}

type SchemaOpts = {
    format: string;
    min?: string;
    max?: string;
};

export type DatetimeValidatorOpts =
    | string
    | (SchemaPropertyBaseValidator & SchemaOpts);

export function datetime(
    opts: SchemaOpts,
    expect?: string,
): SchemaDatetimeValidator {
    return {
        datetime: {
            ...opts,
            ...optional("error", expect),
        },
    };
}

export const datetimeValidator = {
    name: "datetime" as const,
    factory: (
        selector: string,
        type: ValidationType,
        opts: DatetimeValidatorOpts,
    ) => new DatetimeValidator(selector, type, opts),
};

/**
 * Datetime validator.
 * Validates if a string matches the specified datetime format using date-fns format patterns.
 * See https://date-fns.org/v4.1.0/docs/format for available format patterns.
 *
 * Common format patterns:
 * - yyyy: 4-digit year
 * - MM: 2-digit month (01-12)
 * - dd: 2-digit day (01-31)
 * - HH: 2-digit hour in 24-hour format (00-23)
 * - mm: 2-digit minute (00-59)
 * - ss: 2-digit second (00-59)
 *
 * Options:
 * - format: The date-fns format pattern to validate against (required)
 * - min: Optional minimum date limit as a string in the same format.
 *   If provided, dates before this limit will be considered invalid.
 * - max: Optional maximum date limit as a string in the same format.
 *   If provided, dates after this limit will be considered invalid.
 */
export class DatetimeValidator
    extends AbstractValidator<DatetimeValidatorOpts>
    implements Validator
{
    private readonly format: string;
    private readonly min?: Date;
    private readonly max?: Date;

    constructor(
        attachTo: string,
        type: ValidationType,
        opts: DatetimeValidatorOpts,
    ) {
        super(attachTo, type, opts);

        if (typeof opts === "string") {
            this.format = opts;
        } else {
            this.format = opts.format;

            // Handle min if provided
            if (opts.min) {
                // Parse the min string using the same format
                const parsedMin = parse(opts.min, this.format, new Date());
                if (isValid(parsedMin)) {
                    this.min = parsedMin;
                }
            }

            // Handle max if provided
            if (opts.max) {
                // Parse the max string using the same format
                const parsedMax = parse(opts.max, this.format, new Date());
                if (isValid(parsedMax)) {
                    this.max = parsedMax;
                }
            }
        }
    }

    validate(ctx: ValidationContext): ValidatorResponse {
        if (typeof ctx.value !== "string") {
            return this.error(ValidatorErrors.Datetime.InvalidType);
        }

        if (ctx.value.trim() === "") {
            return this.error(ValidatorErrors.Datetime.InvalidFormat, {
                format: this.format,
            });
        }

        try {
            // Parse the date using date-fns
            const parsedDate = parse(ctx.value, this.format, new Date());

            // Check if the date is valid
            if (isValid(parsedDate)) {
                // If min is set, check if the parsed date is greater than or equal to the minimum date
                if (
                    this.min &&
                    !(
                        isAfter(parsedDate, this.min) ||
                        isEqual(parsedDate, this.min)
                    )
                ) {
                    return this.error(ValidatorErrors.Datetime.BeforeMin, {
                        min: this.min,
                    });
                }

                // If max is set, check if the parsed date is less than or equal to the maximum date
                if (
                    this.max &&
                    !(
                        isAfter(this.max, parsedDate) ||
                        isEqual(parsedDate, this.max)
                    )
                ) {
                    return this.error(ValidatorErrors.Datetime.AfterMax, {
                        max: this.max,
                    });
                }

                return this.success();
            }

            return this.error(ValidatorErrors.Datetime.InvalidValue);
        } catch (_e) {
            return this.error(ValidatorErrors.Datetime.InvalidFormat, {
                format: this.format,
            });
        }
    }
}
