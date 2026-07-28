import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

export type SchemaIntegerValidator =
    | "integer"
    | { integer: IntegerValidatorOpts };

export interface IntegerValidatorOpts extends SchemaPropertyBaseValidator {}

export const integerValidator = validatorDeclarationBuilder(
    "integer",
    /^-?\d+$/,
);

export function integer(expect?: string): SchemaIntegerValidator {
    return schemaFn("integer", expect) as SchemaIntegerValidator;
}
