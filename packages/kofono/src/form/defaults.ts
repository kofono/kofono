import { ExtensionsFactory } from "../extension/ExtensionsFactory";
import type { ValidatorResponse } from "../validator/types";
import { ValidatorsFactory } from "../validator/ValidatorsFactory";
import type { Form } from "./Form";
import { type FormConfig, FormEnv, type PassHandler } from "./types";

export const defaultPassHandler: PassHandler = (
    form: Form,
): ValidatorResponse => {
    if (form.state.stats.progression === 100) {
        return [true, ""];
    }
    return [false, "_FORM_NOT_COMPLETE"];
};

export const defaultConfig: FormConfig = Object.freeze({
    env: FormEnv.prod,
    passHandler: defaultPassHandler,
    validatorsFactory: new ValidatorsFactory(),
    extensionsFactory: new ExtensionsFactory(),
    vars: {},
});
