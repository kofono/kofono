import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

// Ipv4
export type SchemaIpv4Validator = "ipv4" | { ipv4: Ipv4ValidatorOpts };

export interface Ipv4ValidatorOpts extends SchemaPropertyBaseValidator {}

export const ipv4Validator = validatorDeclarationBuilder(
    "ipv4",
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
);

export function ipv4(expect?: string): SchemaIpv4Validator {
    return schemaFn("ipv4", expect) as SchemaIpv4Validator;
}

// Ipv6
export type SchemaIpv6Validator = "ipv6" | { ipv6: Ipv6ValidatorOpts };

export interface Ipv6ValidatorOpts extends SchemaPropertyBaseValidator {}

export const ipv6Validator = validatorDeclarationBuilder(
    "ipv6",
    /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/,
);

export function ipv6(expect?: string): SchemaIpv6Validator {
    return schemaFn("ipv6", expect) as SchemaIpv6Validator;
}
