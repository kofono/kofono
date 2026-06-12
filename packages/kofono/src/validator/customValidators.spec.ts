import { describe, expect, it } from "vitest";
import { K } from "../builder/K";
import { optional } from "../common/helpers";
import type { FormConfig } from "../form/types";
import { isValid } from "./builtinValidators";
import { GenericValidator } from "./GenericValidator";
import type {
    SchemaPropertyBaseValidator,
    SchemaPropertyValidator,
} from "./schema";

type CustomValidatorOpts = SchemaPropertyBaseValidator & {
    value: string;
};

// this is a test custom schema function
function custom(value: string, expect?: string): SchemaPropertyValidator {
    return {
        custom: {
            value,
            ...optional("error", expect),
        },
    } as unknown as SchemaPropertyValidator;
}

describe("Custom validators", () => {
    it("custom validator using GenericValidator basic implementation with no dependency", async () => {
        const config: Partial<FormConfig> = {
            init: ctx => {
                ctx.form.validatorsFactory.register(
                    // the schema name of the validator
                    "custom",
                    // validator factory, we use GenericValidator to wrap our validation callback
                    (selector, type, opts: CustomValidatorOpts) =>
                        new GenericValidator<CustomValidatorOpts>(
                            selector, // selector target
                            type, // validation type (validation or qualification)
                            opts, // validator options
                            // validation callback
                            async v => {
                                return v.error("CUSTOM_ERROR");
                            },
                        ),
                );
            },
        };

        const form = await K.form(
            {
                name: K.string(custom("something")),
            },
            config,
        );

        expect(form.state.validations).toEqual({
            name: [false, "CUSTOM_ERROR"],
        });
    });

    it("shorter custom validator with FormConfigInitializer basic implementation with no dependency", async () => {
        const config: Partial<FormConfig> = {
            init: ctx => {
                // this helper will wrap for us our validation callback with GenericValidator
                ctx.addValidator<CustomValidatorOpts>(
                    // the schema name of the validator
                    "custom",
                    // validation callback
                    async (v, ctx) => {
                        return ctx.value === v.opts.value
                            ? v.success()
                            : v.error("CUSTOM_ERROR", {
                                  expect: v.opts.value,
                                  given: ctx.value,
                              });
                    },
                );
            },
        };

        const form = await K.form(
            {
                name: K.string(custom("something")),
            },
            config,
        );

        expect(form.state.validations).toEqual({
            name: [false, "CUSTOM_ERROR", { expect: "something", given: null }],
        });

        await form.update("name", "something");

        expect(form.state.validations).toEqual({ name: [true, ""] });
    });

    it("custom validator dependency as validation", async () => {
        const config: Partial<FormConfig> = {
            init: ctx => {
                ctx.addValidator<CustomValidatorOpts>(
                    "custom",
                    async (v, ctx) => {
                        return ctx.value === v.opts.value
                            ? v.success()
                            : v.error("CUSTOM_ERROR", {
                                  expect: v.opts.value,
                                  given: ctx.value,
                              });
                    },
                );
            },
        };

        const form = await K.form(
            {
                name: K.string(custom("something")),
                age: K.number().qualifications(isValid("name")),
            },
            config,
        );

        expect(form.prop("name").isValid()).toBeFalsy();
        expect(form.prop("age").isQualified()).toBeFalsy();

        await form.update("name", "something");

        expect(form.prop("name").isValid()).toBeTruthy();
        expect(form.prop("age").isQualified()).toBeTruthy();

        await form.update("name", "something else");

        expect(form.prop("name").isValid()).toBeFalsy();
        expect(form.prop("age").isQualified()).toBeFalsy();
    });

    it("custom validator dependency as qualification", async () => {
        const config: Partial<FormConfig> = {
            init: ctx => {
                ctx.addValidator<CustomValidatorOpts>(
                    "custom",
                    async (v, ctx) => {
                        return ctx.form.prop(v.opts.value).value === "bob"
                            ? v.success()
                            : v.error("CUSTOM_ERROR", {
                                  expect: v.opts.value,
                                  given: ctx.value,
                              });
                    },
                    // This is called each time a custom validator is attached somewhere in the schema.
                    // Here we use the validator opt value as the selector dependency,
                    // so when the target is updated, the custom validator is re-executed
                    v => [v.opts.value],
                );
            },
        };

        const form = await K.form(
            {
                firstname: K.string(),
                lastname: K.number().qualifications(custom("firstname")),
            },
            config,
        );

        expect(form.prop("firstname").isValid()).toBeTruthy();
        expect(form.prop("lastname").isQualified()).toBeFalsy();

        await form.update("firstname", "bob");

        expect(form.prop("firstname").isValid()).toBeTruthy();
        expect(form.prop("lastname").isQualified()).toBeTruthy();

        await form.update("firstname", "john");

        expect(form.prop("firstname").isValid()).toBeTruthy();
        expect(form.prop("lastname").isQualified()).toBeFalsy();
    });
});
