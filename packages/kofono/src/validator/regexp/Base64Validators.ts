import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const _base64: RegExp =
    /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const _base64url: RegExp = /^[A-Za-z0-9_-]*$/;

// base64
export type SchemaBase64Validator = "base64" | { base64: Base64ValidatorOpts };

export interface Base64ValidatorOpts extends SchemaPropertyBaseValidator {}

export const base64Validator = validatorDeclarationBuilder(
    "base64",
    _base64,
    "_BASE64_INVALID",
);

export function base64(expect?: string): SchemaBase64Validator {
    return schemaFn("base64", expect) as SchemaBase64Validator;
}

// base64url
export type SchemaBase64urlValidator =
    | "base64url"
    | { base64url: Base64ValidatorOpts };

export interface Base64urlValidatorOpts extends SchemaPropertyBaseValidator {}

export const base64urlValidator = validatorDeclarationBuilder(
    "base64url",
    _base64url,
    "_BASE64URL_INVALID",
);

export function base64url(expect?: string): SchemaBase64urlValidator {
    return schemaFn("base64url", expect) as SchemaBase64urlValidator;
}
