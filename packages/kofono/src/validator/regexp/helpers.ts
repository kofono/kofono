import { optional } from "../../common/helpers";
import type { ValidationType, ValidatorDeclaration } from "../types";
import { RegexpValidator } from "./RegexpValidator";

export function validatorDeclarationBuilder(
    name: string,
    pattern: RegExp,
    expect?: string,
): ValidatorDeclaration {
    return {
        name,
        factory: (selector: string, type: ValidationType) =>
            new RegexpValidator(selector, type, {
                pattern: pattern.source,
                ...optional("error", expect),
            }),
    };
}

export function schemaFn(name: string, expect?: string) {
    return {
        [name]: {
            ...optional("error", expect),
        },
    };
}
