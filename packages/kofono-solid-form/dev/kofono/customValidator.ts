import { GenericValidator, type SchemaPropertyBaseValidator } from "kofono";

interface CustomValidatorOpts extends SchemaPropertyBaseValidator {
    value: string;
}

export const customValidator = (selector, type, opts: CustomValidatorOpts) =>
    new GenericValidator<CustomValidatorOpts>(
        selector, // selector target
        type, // validation type (validation or qualification)
        opts, // validator options
        async v => {
            return v.error("CUSTOM_ERROR");
        },
    );
