import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

const _ipv4 =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const _ipv6 =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const _cidrv4 =
    /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const _cidrv6 =
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;

// Ipv4
export type SchemaIpv4Validator = "ipv4" | { ipv4: Ipv4ValidatorOpts };

export interface Ipv4ValidatorOpts extends SchemaPropertyBaseValidator {}

export const ipv4Validator = validatorDeclarationBuilder(
    "ipv4",
    _ipv4,
    "_IPV4_INVALID",
);

export function ipv4(expect?: string): SchemaIpv4Validator {
    return schemaFn("ipv4", expect) as SchemaIpv4Validator;
}

// Ipv6
export type SchemaIpv6Validator = "ipv6" | { ipv6: Ipv6ValidatorOpts };

export interface Ipv6ValidatorOpts extends SchemaPropertyBaseValidator {}

export const ipv6Validator = validatorDeclarationBuilder(
    "ipv6",
    _ipv6,
    "_IPV6_INVALID",
);

export function ipv6(expect?: string): SchemaIpv6Validator {
    return schemaFn("ipv6", expect) as SchemaIpv6Validator;
}

// Cidrv4
export type SchemaCidrv4Validator = "cidrv4" | { cidrv4: Cidrv4ValidatorOpts };

export interface Cidrv4ValidatorOpts extends SchemaPropertyBaseValidator {}

export const cidrv4Validator = validatorDeclarationBuilder(
    "cidrv4",
    _cidrv4,
    "_CIDRV4_INVALID",
);

export function cidrv4(expect?: string): SchemaCidrv4Validator {
    return schemaFn("cidrv4", expect) as SchemaCidrv4Validator;
}

// Cidrv6
export type SchemaCidrv6Validator = "cidrv6" | { cidrv6: Cidrv6ValidatorOpts };

export interface Cidrv6ValidatorOpts extends SchemaPropertyBaseValidator {}

export const cidrv6Validator = validatorDeclarationBuilder(
    "cidrv6",
    _cidrv6,
    "_CIDRV6_INVALID",
);

export function cidrv6(expect?: string): SchemaCidrv6Validator {
    return schemaFn("cidrv6", expect) as SchemaCidrv6Validator;
}
