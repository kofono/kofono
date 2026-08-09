import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

const _lowercase: RegExp = /^[^A-Z]*$/;
const _uppercase: RegExp = /^[^a-z]*$/;
const _hex: RegExp = /^[0-9a-fA-F]*$/;

// lowercase
export type SchemaLowercaseValidator =
    | "lowercase"
    | { lowercase: LowercaseValidatorOpts };

export interface LowercaseValidatorOpts extends SchemaPropertyBaseValidator {}

export const lowercaseValidator = validatorDeclarationBuilder(
    "lowercase",
    _lowercase,
    "_LOWERCASE_INVALID",
);

export function lowercase(expect?: string): SchemaLowercaseValidator {
    return schemaFn("lowercase", expect) as SchemaLowercaseValidator;
}

// uppercase
export type SchemaUppercaseValidator =
    | "uppercase"
    | { uppercase: UppercaseValidatorOpts };

export interface UppercaseValidatorOpts extends SchemaPropertyBaseValidator {}

export const uppercaseValidator = validatorDeclarationBuilder(
    "uppercase",
    _uppercase,
    "_UPPERCASE_INVALID",
);

export function uppercase(expect?: string): SchemaUppercaseValidator {
    return schemaFn("uppercase", expect) as SchemaUppercaseValidator;
}

// hexadecimal
export type SchemaHexValidator = "hex" | { hex: HexValidatorOpts };

export interface HexValidatorOpts extends SchemaPropertyBaseValidator {}

export const hexValidator = validatorDeclarationBuilder(
    "hex",
    _hex,
    "_HEX_INVALID",
);

export function hex(expect?: string): SchemaHexValidator {
    return schemaFn("hex", expect) as SchemaHexValidator;
}
