import type { Form } from "../form/Form";
import type { Property } from "../property/Property";
import type { Schema, SchemaProperty } from "../schema/Schema";
import type { Token } from "../schema/Tokens";
import type { PropertyDeclaration } from "./k/PropertyDeclaration";

export interface PropertyBuilder<TSchemaType extends SchemaProperty> {
    build(): Property<TSchemaType>;
}

export type SchemaBuildResult =
    | SchemaBuildResultSucceed
    | SchemaBuildResultFailed;

export type SchemaBuildResultSucceed = {
    error: undefined;
    form: Form;
};

export type SchemaBuildResultFailed = {
    error: Error;
    form: undefined;
};

export interface SchemaDeclaration {
    $id?: Schema[Token.SchemaId];
    $vars?: Schema[Token.SchemaVars];
    $extensions?: Schema[Token.SchemaExtensions];
    $translations?: Schema[Token.SchemaTranslations];
    [
        key: Exclude<
            string,
            | Token.SchemaId
            | Token.SchemaVars
            | Token.SchemaExtensions
            | Token.SchemaTranslations
        >
    ]:
        | PropertyDeclaration
        | Schema[Token.SchemaId]
        | Schema[Token.SchemaVars]
        | Schema[Token.SchemaExtensions]
        | Schema[Token.SchemaTranslations];
}
