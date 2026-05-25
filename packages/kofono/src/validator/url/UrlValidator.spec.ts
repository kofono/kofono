import { beforeAll, describe, expect, it } from "vitest";
import { SchemaBuilder } from "../../builder/SchemaBuilder";
import type { Form } from "../../form/Form";
import type { ValidationContext } from "../types";
import { UrlValidator, urlValidator } from "./UrlValidator";

describe("urlValidator test", () => {
    let form: Form;
    let ctx: ValidationContext;
    beforeAll(async () => {
        form = await new SchemaBuilder().buildEmpty();
        ctx = {
            selector: "test",
            value: "",
            form: form,
        };
    });

    describe("without protocol restrictions", () => {
        const validator = new UrlValidator("test", "validation", {});

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
                value: "       ",
            },
            {
                expected: false,
                value: "a",
            },
            {
                expected: false,
                value: " a",
            },
            {
                expected: false,
                value: "0",
            },
            {
                expected: false,
                value: "example.com",
            },
            {
                expected: false,
                value: "www.example.com",
            },

            // single or multiple slashed are allowed (URL class is based on WHATWG specification)
            // see https://url.spec.whatwg.org
            {
                expected: true,
                value: "ftp:/example.com",
            },
            {
                expected: true,
                value: "http:/example.com",
            },
            {
                expected: true,
                value: "https:/example.com",
            },

            {
                expected: true,
                value: "http://example.com",
            },
            {
                expected: true,
                value: "https://example.com",
            },
            {
                expected: true,
                value: "ftp://example.com",
            },
            {
                expected: true,
                value: "http://www.example.com",
            },
            {
                expected: true,
                value: "https://www.example.com/path",
            },
            {
                expected: true,
                value: "https://www.example.com/path?query=value",
            },
            {
                expected: true,
                value: "https://www.example.com:8080",
            },
            {
                expected: true,
                value: "https://user:pass@example.com",
            },
        ];

        for (const test of tests) {
            it(`should return ${test.expected} for '${test.value}'`, () => {
                ctx.value = test.value;
                const [isValid] = validator.validate(ctx);
                expect(isValid).toEqual(test.expected);
            });
        }
    });

    describe("with protocol restrictions", () => {
        const validatorHttpOnly = new UrlValidator("test", "validation", {
            protocols: ["http"],
        });

        const validatorHttpsOnly = new UrlValidator("test", "validation", {
            protocols: ["https"],
        });

        const validatorHttpAndHttps = new UrlValidator("test", "validation", {
            protocols: ["http", "https"],
        });

        describe("http only", () => {
            const tests: {
                value: string;
                expected: boolean;
                errorCode?: string;
            }[] = [
                {
                    expected: true,
                    value: "http://example.com",
                },
                {
                    expected: false,
                    value: "https://example.com",
                    errorCode: urlValidator.err.ProtocolUnallowed,
                },
                {
                    expected: false,
                    value: "ftp://example.com",
                    errorCode: urlValidator.err.ProtocolUnallowed,
                },
            ];

            for (const test of tests) {
                it(`should return ${test.expected} for '${test.value}'`, () => {
                    ctx.value = test.value;
                    const [isValid, errorCode] =
                        validatorHttpOnly.validate(ctx);
                    expect(isValid).toEqual(test.expected);
                    if (!test.expected) {
                        expect(errorCode).toEqual(test.errorCode);
                    }
                });
            }
        });

        describe("https only", () => {
            const tests: {
                value: string;
                expected: boolean;
                errorCode?: string;
            }[] = [
                {
                    expected: true,
                    value: "https://example.com",
                },
                {
                    expected: false,
                    value: "http://example.com",
                    errorCode: urlValidator.err.ProtocolUnallowed,
                },
            ];

            for (const test of tests) {
                it(`should return ${test.expected} for '${test.value}'`, () => {
                    ctx.value = test.value;
                    const [isValid, errorCode] =
                        validatorHttpsOnly.validate(ctx);
                    expect(isValid).toEqual(test.expected);
                    if (!test.expected) {
                        expect(errorCode).toEqual(test.errorCode);
                    }
                });
            }
        });

        describe("http and https", () => {
            const tests: {
                value: string;
                expected: boolean;
                errorCode?: string;
            }[] = [
                {
                    expected: true,
                    value: "http://example.com",
                },
                {
                    expected: true,
                    value: "https://example.com",
                },
                {
                    expected: false,
                    value: "ftp://example.com",
                    errorCode: urlValidator.err.ProtocolUnallowed,
                },
            ];

            for (const test of tests) {
                it(`should return ${test.expected} for '${test.value}'`, () => {
                    ctx.value = test.value;
                    const [isValid, errorCode] =
                        validatorHttpAndHttps.validate(ctx);
                    expect(isValid).toEqual(test.expected);
                    if (!test.expected) {
                        expect(errorCode).toEqual(test.errorCode);
                    }
                });
            }
        });
    });

    describe("with hostname restrictions", () => {
        const validatorExampleOnly = new UrlValidator("test", "validation", {
            hostnames: ["example.com"],
        });

        const validatorWwwExampleOnly = new UrlValidator("test", "validation", {
            hostnames: ["www.example.com"],
        });

        const validatorMultipleHosts = new UrlValidator("test", "validation", {
            hostnames: ["example.com", "www.example.com", "test.com"],
        });

        describe("example.com only", () => {
            const tests: {
                value: string;
                expected: boolean;
                errorCode?: string;
            }[] = [
                {
                    expected: true,
                    value: "https://example.com",
                },
                {
                    expected: false,
                    value: "https://test.com",
                    errorCode: urlValidator.err.HostnameUnallowed,
                },
            ];

            for (const test of tests) {
                it(`should return ${test.expected} for '${test.value}'`, () => {
                    ctx.value = test.value;
                    const [isValid, errorCode] =
                        validatorExampleOnly.validate(ctx);
                    expect(isValid).toEqual(test.expected);
                    if (!test.expected) {
                        expect(errorCode).toEqual(test.errorCode);
                    }
                });
            }
        });

        describe("www.example.com only", () => {
            const tests: {
                value: string;
                expected: boolean;
                errorCode?: string;
            }[] = [
                {
                    expected: true,
                    value: "https://www.example.com",
                },
                {
                    expected: false,
                    value: "https://example.com",
                    errorCode: urlValidator.err.HostnameUnallowed,
                },
            ];

            for (const test of tests) {
                it(`should return ${test.expected} for '${test.value}'`, () => {
                    ctx.value = test.value;
                    const [isValid, errorCode] =
                        validatorWwwExampleOnly.validate(ctx);
                    expect(isValid).toEqual(test.expected);
                    if (!test.expected) {
                        expect(errorCode).toEqual(test.errorCode);
                    }
                });
            }
        });

        describe("multiple hostnames", () => {
            const tests: {
                value: string;
                expected: boolean;
                errorCode?: string;
            }[] = [
                {
                    expected: true,
                    value: "https://test.com",
                },
                {
                    expected: true,
                    value: "https://example.com",
                },
                {
                    expected: true,
                    value: "https://www.example.com",
                },
                {
                    expected: false,
                    value: "https://unknown.com",
                    errorCode: urlValidator.err.HostnameUnallowed,
                },
            ];

            for (const test of tests) {
                it(`should return ${test.expected} for '${test.value}'`, () => {
                    ctx.value = test.value;
                    const [isValid, errorCode] =
                        validatorMultipleHosts.validate(ctx);
                    expect(isValid).toEqual(test.expected);
                    if (!test.expected) {
                        expect(errorCode).toEqual(test.errorCode);
                    }
                });
            }
        });

        describe("with both protocol and hostname restrictions", () => {
            const validatorWithBothRestrictions = new UrlValidator(
                "test",
                "validation",
                {
                    protocols: ["https"],
                    hostnames: ["example.com"],
                },
            );

            const tests: {
                value: string;
                expected: boolean;
                errorCode?: string;
            }[] = [
                {
                    expected: true,
                    value: "https://example.com",
                },
                {
                    expected: false,
                    value: "http://example.com",
                    errorCode: urlValidator.err.ProtocolUnallowed,
                },
                {
                    expected: false,
                    value: "https://test.com",
                    errorCode: urlValidator.err.HostnameUnallowed,
                },
            ];

            for (const test of tests) {
                it(`should return ${test.expected} for '${test.value}'`, () => {
                    ctx.value = test.value;
                    const [isValid, errorCode] =
                        validatorWithBothRestrictions.validate(ctx);
                    expect(isValid).toEqual(test.expected);
                    if (!test.expected) {
                        expect(errorCode).toEqual(test.errorCode);
                    }
                });
            }
        });
    });
});
