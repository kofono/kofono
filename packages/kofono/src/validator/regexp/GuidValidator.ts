import type { SchemaPropertyBaseValidator } from "../schema";
import { schemaFn, validatorDeclarationBuilder } from "./helpers";

export type SchemaGuidValidator = "guid" | { guid: GuidValidatorOpts };

export interface GuidValidatorOpts extends SchemaPropertyBaseValidator {}

export const guidValidator = validatorDeclarationBuilder(
    "guid",
    /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
);

export function guid(expect?: string): SchemaGuidValidator {
    return schemaFn("guid", expect) as SchemaGuidValidator;
}
