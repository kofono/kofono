import type { Form } from "../form/Form";
import type { AbstractValidator } from "./AbstractValidator";
import type { SchemaPropertyBaseValidator } from "./schema";

export interface ValidationContext {
    form: Form;
    selector: string;
    value: any;
}

export type ValidatorResponse = [
    isValid: boolean,
    errorCode: string,
    context?: ValidatorResponseContext,
];

export type ValidatorResponseContext = Record<string, any>;

export type ValidationType = "qualification" | "validation";

export interface Validator {
    readonly attachTo: string;
    readonly type: ValidationType;

    validate(
        context: ValidationContext,
    ): ValidatorResponse | Promise<ValidatorResponse>;
    dependencies(): string[];
}

export type ValidatorFn<TOptions = GenericValidatorOptions> = (
    v: AbstractValidator<TOptions>,
    ctx: ValidationContext,
) => Promise<ValidatorResponse>;

export type GenericValidatorOptions = SchemaPropertyBaseValidator &
    Record<string, unknown>;

export enum QualificationError {
    SelectorDisqualified = "_SELECTOR_DISQUALIFIED",
    ParentDisqualified = "_PARENT_DISQUALIFIED",
}

export type ValidatorFactoryHandler<TOptions = GenericValidatorOptions> = (
    selector: string,
    type: ValidationType,
    opts: TOptions,
) => Validator;

export type ValidatorDeclaration<TOptions = GenericValidatorOptions> = {
    name: string;
    factory: ValidatorFactoryHandler<TOptions>;
    err?: Record<string, string>;
};
