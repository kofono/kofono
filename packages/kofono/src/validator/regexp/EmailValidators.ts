// generic email validation

import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

const _email: RegExp =
    /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

// equivalent to the HTML5 input[type=email] validation implemented by browsers. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email
const _html5Email: RegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// the classic emailregex.com regex for RFC 5322-compliant emails
export const _rfc5322Email =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// email
export type SchemaEmailValidator = "email" | { email: EmailValidatorOpts };

export interface EmailValidatorOpts extends SchemaPropertyBaseValidator {}

export const emailValidator = validatorDeclarationBuilder(
    "email",
    _email,
    "_EMAIL_INVALID",
);

export function email(expect?: string): SchemaEmailValidator {
    return schemaFn("email", expect) as SchemaEmailValidator;
}

// html5 email
export type SchemaHtml5EmailValidator =
    | "html5Email"
    | { html5Email: EmailValidatorOpts };

export interface Html5EmailValidatorOpts extends SchemaPropertyBaseValidator {}

export const html5EmailValidator = validatorDeclarationBuilder(
    "html5Email",
    _html5Email,
    "_HTML5EMAIL_INVALID",
);

export function html5Email(expect?: string): SchemaHtml5EmailValidator {
    return schemaFn("html5Email", expect) as SchemaHtml5EmailValidator;
}

// RFC-5322 email
export type SchemaRfc5322EmailValidator =
    | "rfc5322Email"
    | { rfc5322Email: EmailValidatorOpts };

export interface Rfc5322EmailValidatorOpts
    extends SchemaPropertyBaseValidator {}

export const rfc5322EmailValidator = validatorDeclarationBuilder(
    "rfc5322Email",
    _rfc5322Email,
    "_RFC5322EMAIL_INVALID",
);

export function rfc5322Email(expect?: string): SchemaRfc5322EmailValidator {
    return schemaFn("rfc5322Email", expect) as SchemaRfc5322EmailValidator;
}
