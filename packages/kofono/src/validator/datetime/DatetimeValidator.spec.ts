import { beforeAll, describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";
import type { ValidationContext } from "../types";
import { DatetimeValidator, datetimeValidator } from "./DatetimeValidator";

describe("datetimeValidator test", () => {
    let form: Form;
    let ctx: ValidationContext;
    beforeAll(async () => {
        form = await K.form({});
        ctx = {
            selector: "test",
            value: "",
            form: form,
        };
    });

    describe("format yyyy-MM-dd HH:mm:ss", () => {
        const validator = new DatetimeValidator(
            "test",
            "validation",
            "yyyy-MM-dd HH:mm:ss",
        );

        const tests: {
            value: string;
            expected: boolean;
        }[] = [
            {
                expected: false,
                value: "",
            },
            {
                expected: false,
                value: " ",
            },
            {
                expected: false,
                value: "2023-13-01 12:30:45",
            }, // Invalid month
            {
                expected: false,
                value: "2023-02-30 12:30:45",
            }, // Invalid day for February
            {
                expected: false,
                value: "2023-04-31 12:30:45",
            }, // Invalid day for April
            {
                expected: false,
                value: "2023-06-31 12:30:45",
            }, // Invalid day for June
            {
                expected: false,
                value: "2023-09-31 12:30:45",
            }, // Invalid day for September
            {
                expected: false,
                value: "2023-11-31 12:30:45",
            }, // Invalid day for November
            {
                expected: false,
                value: "2023-01-01 24:30:45",
            }, // Invalid hour
            {
                expected: false,
                value: "2023-01-01 12:60:45",
            }, // Invalid minute
            {
                expected: false,
                value: "2023-01-01 12:30:60",
            }, // Invalid second
            {
                expected: false,
                value: "01-01-2023 12:30:45",
            }, // Wrong format
            {
                expected: false,
                value: "2023/01/01 12:30:45",
            }, // Wrong format
            {
                expected: true,
                value: "2023-01-01 12:30:45",
            },
            {
                expected: true,
                value: "2023-02-28 12:30:45",
            },
            {
                expected: true,
                value: "2023-12-31 23:59:59",
            },
            {
                expected: true,
                value: "2023-01-01 00:00:00",
            },
            {
                expected: false,
                value: "2023-01-01",
            },
            {
                expected: true,
                value: "2020-02-29 12:30:45",
            }, // Leap year
        ];

        for (const test of tests) {
            it(`should return ${test.expected} for '${test.value}'`, () => {
                ctx.value = test.value;
                const [isValid] = validator.validate(ctx);
                expect(isValid).toEqual(test.expected);
            });
        }
    });

    describe("custom format (dd/MM/yyyy)", () => {
        const validator = new DatetimeValidator("test", "validation", {
            format: "dd/MM/yyyy",
        });

        const tests: {
            value: string;
            expected: boolean;
        }[] = [
            {
                expected: false,
                value: "",
            },
            {
                expected: false,
                value: " ",
            },
            {
                expected: false,
                value: "32/01/2023",
            }, // Invalid day
            {
                expected: false,
                value: "30/02/2023",
            }, // Invalid day for February
            {
                expected: false,
                value: "31/04/2023",
            }, // Invalid day for April
            {
                expected: false,
                value: "31/06/2023",
            }, // Invalid day for June
            {
                expected: false,
                value: "31/09/2023",
            }, // Invalid day for September
            {
                expected: false,
                value: "31/11/2023",
            }, // Invalid day for November
            {
                expected: false,
                value: "01/13/2023",
            }, // Invalid month
            {
                expected: false,
                value: "01-01-2023",
            }, // Wrong format
            {
                expected: false,
                value: "2023/01/01",
            }, // Wrong format
            {
                expected: true,
                value: "01/01/2023",
            },
            {
                expected: true,
                value: "28/02/2023",
            },
            {
                expected: true,
                value: "31/12/2023",
            },
            {
                expected: true,
                value: "29/02/2020",
            }, // Leap year
        ];

        for (const test of tests) {
            it(`should return ${test.expected} for '${test.value}'`, () => {
                ctx.value = test.value;
                const [isValid] = validator.validate(ctx);
                expect(isValid).toEqual(test.expected);
            });
        }
    });

    describe("min validation (yyyy-MM-dd)", () => {
        const format = "yyyy-MM-dd";
        const minStr = "2023-01-15";

        const validator = new DatetimeValidator("test", "validation", {
            format,
            min: minStr,
        });

        const tests: {
            value: string;
            expected: boolean;
            description?: string;
        }[] = [
            {
                expected: false,
                value: "2023-01-14",
                description: "Before min date",
            },
            {
                expected: true,
                value: "2023-01-15",
                description: "Equal to min date",
            },
            {
                expected: true,
                value: "2023-01-16",
                description: "After min date",
            },
            {
                expected: false,
                value: "2022-12-31",
                description: "Previous year",
            },
            {
                expected: true,
                value: "2023-02-01",
                description: "Next month",
            },
            {
                expected: true,
                value: "2024-01-01",
                description: "Next year",
            },
            {
                expected: false,
                value: "",
                description: "Empty string",
            },
            {
                expected: false,
                value: "invalid",
                description: "Invalid format",
            },
        ];

        for (const test of tests) {
            it(`should return ${test.expected} for '${test.value}' (${test.description})`, () => {
                ctx.value = test.value;
                const [isValid, errorCode] = validator.validate(ctx);
                expect(isValid).toEqual(test.expected);
                if (!isValid && test.value && test.value !== "invalid") {
                    expect(errorCode).toEqual(datetimeValidator.err.BeforeMin);
                }
            });
        }
    });

    describe("max validation (yyyy-MM-dd HH:mm:ss)", () => {
        const format = "yyyy-MM-dd HH:mm:ss";
        const maxStr = "2023-01-15 23:59:59";

        const validator = new DatetimeValidator("test", "validation", {
            format,
            max: maxStr,
        });

        const tests: {
            value: string;
            expected: boolean;
            description?: string;
        }[] = [
            {
                expected: true,
                value: "2023-01-14 23:59:59",
                description: "Before max date",
            },
            {
                expected: true,
                value: "2023-01-15 23:59:59",
                description: "Equal to max date",
            },
            {
                expected: false,
                value: "2023-01-16 00:00:00",
                description: "After max date",
            },
            {
                expected: true,
                value: "2022-12-31 23:59:59",
                description: "Previous year",
            },
            {
                expected: false,
                value: "2023-02-01 00:00:00",
                description: "Next month",
            },
            {
                expected: false,
                value: "2024-01-01 00:00:00",
                description: "Next year",
            },
            {
                expected: false,
                value: "",
                description: "Empty string",
            },
            {
                expected: false,
                value: "invalid",
                description: "Invalid format",
            },
        ];

        for (const test of tests) {
            it(`should return ${test.expected} for '${test.value}' (${test.description})`, () => {
                ctx.value = test.value;
                const [isValid, errorCode] = validator.validate(ctx);
                expect(isValid).toEqual(test.expected);
                if (
                    !isValid &&
                    test.value &&
                    test.value !== "invalid" &&
                    test.value !== ""
                ) {
                    expect(errorCode).toEqual(datetimeValidator.err.AfterMax);
                }
            });
        }
    });
});
