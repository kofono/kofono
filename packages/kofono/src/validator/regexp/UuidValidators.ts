import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

/**
 * RFC 9562/4122 UUID.
 * @source https://github.com/colinhacks/zod/blob/main/packages/zod/src/v4/core/regexes.ts
 */
function _uuid(version?: number | undefined): RegExp {
    if (!version) {
        return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
    }
    return new RegExp(
        `^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`,
    );
}

// uuid
export type SchemaUuidValidator = "uuid" | { uuid: UuidValidatorOpts };

export interface UuidValidatorOpts extends SchemaPropertyBaseValidator {}

export const uuidValidator = validatorDeclarationBuilder(
    "uuid",
    _uuid(),
    "_UUID_INVALID",
);

export function uuid(expect?: string): SchemaUuidValidator {
    return schemaFn("uuid", expect) as SchemaUuidValidator;
}

// uuid v4
export type SchemaUuidV4Validator = "uuidV4" | { uuidV4: UuidValidatorOpts };

export const uuidV4Validator = validatorDeclarationBuilder(
    "uuidV4",
    _uuid(4),
    "_UUIDV4_INVALID",
);

export function uuidV4(expect?: string): SchemaUuidV4Validator {
    return schemaFn("uuidV4", expect) as SchemaUuidV4Validator;
}

// uuid v6
export type SchemaUuidV6Validator = "uuidV6" | { uuidV6: UuidValidatorOpts };

export const uuidV6Validator = validatorDeclarationBuilder(
    "uuidV6",
    _uuid(6),
    "_UUIDV6_INVALID",
);

export function uuidV6(expect?: string): SchemaUuidV6Validator {
    return schemaFn("uuidV6", expect) as SchemaUuidV6Validator;
}

// uuid v7
export type SchemaUuidV7Validator = "uuidV7" | { uuidV7: UuidValidatorOpts };

export const uuidV7Validator = validatorDeclarationBuilder(
    "uuidV7",
    _uuid(7),
    "_UUIDV7_INVALID",
);

export function uuidV7(expect?: string): SchemaUuidV7Validator {
    return schemaFn("uuidV7", expect) as SchemaUuidV7Validator;
}
