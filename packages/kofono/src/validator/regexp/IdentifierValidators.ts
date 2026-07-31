import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

const _guid: RegExp =
    /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
const _cuid: RegExp = /^[cC][0-9a-z]{6,}$/;
const _cuid2: RegExp = /^[0-9a-z]+$/;
const _ulid: RegExp = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const _xid: RegExp = /^[0-9a-vA-V]{20}$/;
const _ksuid: RegExp = /^[A-Za-z0-9]{27}$/;
const _nanoid: RegExp = /^[a-zA-Z0-9_-]{21}$/;

// guid
export type SchemaGuidValidator = "guid" | { guid: GuidValidatorOpts };

export interface GuidValidatorOpts extends SchemaPropertyBaseValidator {}

export const guidValidator = validatorDeclarationBuilder(
    "guid",
    _guid,
    "_GUID_INVALID",
);

export function guid(expect?: string): SchemaGuidValidator {
    return schemaFn("guid", expect) as SchemaGuidValidator;
}

// cuid
export type SchemaCuidValidator = "cuid" | { cuid: CuidValidatorOpts };

export interface CuidValidatorOpts extends SchemaPropertyBaseValidator {}

export const cuidValidator = validatorDeclarationBuilder(
    "cuid",
    _cuid,
    "_CUID_INVALID",
);

export function cuid(expect?: string): SchemaCuidValidator {
    return schemaFn("cuid", expect) as SchemaCuidValidator;
}

// cuid2
export type SchemaCuid2Validator = "cuid2" | { cuid2: Cuid2ValidatorOpts };

export interface Cuid2ValidatorOpts extends SchemaPropertyBaseValidator {}

export const cuid2Validator = validatorDeclarationBuilder(
    "cuid2",
    _cuid2,
    "_CUID2_INVALID",
);

export function cuid2(expect?: string): SchemaCuid2Validator {
    return schemaFn("cuid2", expect) as SchemaCuid2Validator;
}

// ulid
export type SchemaUlidValidator = "ulid" | { ulid: UlidValidatorOpts };

export interface UlidValidatorOpts extends SchemaPropertyBaseValidator {}

export const ulidValidator = validatorDeclarationBuilder(
    "ulid",
    _ulid,
    "_ULID_INVALID",
);

export function ulid(expect?: string): SchemaUlidValidator {
    return schemaFn("ulid", expect) as SchemaUlidValidator;
}

// xid
export type SchemaXidValidator = "xid" | { xid: XidValidatorOpts };

export interface XidValidatorOpts extends SchemaPropertyBaseValidator {}

export const xidValidator = validatorDeclarationBuilder(
    "xid",
    _xid,
    "_XID_INVALID",
);

export function xid(expect?: string): SchemaXidValidator {
    return schemaFn("xid", expect) as SchemaXidValidator;
}

// ksuid
export type SchemaKsuidValidator = "ksuid" | { ksuid: KsuidValidatorOpts };

export interface KsuidValidatorOpts extends SchemaPropertyBaseValidator {}

export const ksuidValidator = validatorDeclarationBuilder(
    "ksuid",
    _ksuid,
    "_KSUID_INVALID",
);

export function ksuid(expect?: string): SchemaKsuidValidator {
    return schemaFn("ksuid", expect) as SchemaKsuidValidator;
}

// nanoid
export type SchemaNanoidValidator = "nanoid" | { nanoid: NanoidValidatorOpts };

export interface NanoidValidatorOpts extends SchemaPropertyBaseValidator {}

export const nanoidValidator = validatorDeclarationBuilder(
    "nanoid",
    _nanoid,
    "_NANOID_INVALID",
);

export function nanoid(expect?: string): SchemaNanoidValidator {
    return schemaFn("nanoid", expect) as SchemaNanoidValidator;
}
