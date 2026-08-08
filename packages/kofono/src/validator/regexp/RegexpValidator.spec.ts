import { beforeAll, describe, expect, it } from "vitest";
import { buildEmptySchema } from "../../builder/helpers";
import type { Form } from "../../form/Form";
import type { ValidationContext } from "../types";
import { RegexpValidator, type RegexValidatorOpts } from "./RegexpValidator";

describe("equalValidator", () => {
    let form: Form;
    let ctx: ValidationContext = {
        selector: "test",
        value: "",
        form: {} as Form,
    };
    beforeAll(async () => {
        form = await buildEmptySchema();
        ctx = {
            selector: "test",
            value: "",
            form: form,
        };
    });

    const tests: {
        expected: boolean;
        data: any;
        opts: RegexValidatorOpts;
    }[] = [
        {
            expected: false,
            data: "  ",
            opts: {
                pattern: "([A-Z])+",
                flags: "",
            },
        },
        {
            expected: false,
            data: "asdf",
            opts: {
                pattern: "([A-Z])+",
                flags: "",
            },
        },
        {
            expected: false,
            data: false,
            opts: {
                pattern: "([A-Z])+",
                flags: "",
            },
        },
        {
            expected: true,
            data: "ASDF",
            opts: {
                pattern: "([A-Z])+",
                flags: "",
            },
        },
        {
            expected: true,
            data: "ASDF\nASDF",
            opts: {
                pattern: "([A-Z])+",
                flags: "",
            },
        },
        {
            expected: true,
            data: ["T", "E", "S", "T"],
            opts: {
                pattern: "([A-Z])",
                flags: "g",
            },
        },
        {
            expected: false,
            data: ["T", "E", "s", "T"],
            opts: {
                pattern: "([A-Z])",
                flags: "g",
            },
        },
        {
            expected: true,
            data: [],
            opts: {
                pattern: "([A-Z])",
                flags: "g",
            },
        },
    ];

    for (const test of tests) {
        const pattern =
            typeof test.opts === "string" ? test.opts : test.opts.pattern;
        it(`should return ${test.expected} when using pattern '${pattern}' === '${test.data}'`, () => {
            ctx.value = test.data;
            const validator = new RegexpValidator(
                ctx.selector,
                "validation",
                test.opts,
            );
            const [isValid] = validator.validate(ctx);
            expect(isValid).toEqual(test.expected);
        });
    }

    it("should not leak the global/sticky regex lastIndex across array items", () => {
        ctx.value = ["T", "E", "S", "T"];
        const validator = new RegexpValidator(ctx.selector, "validation", {
            pattern: "([A-Z])",
            flags: "g",
        });
        const [isValid] = validator.validate(ctx);
        expect(isValid).toBe(true);
    });
});
