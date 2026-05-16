import type { SchemaExtension } from "../extension/types";
import type { PropertyType } from "../property/types";
import type { SchemaPropertyValidator } from "../validator/schema";
import { Token } from "./Tokens";

export interface Schema {
    $id?: string;
    $vars?: Record<string, unknown>;
    __: SchemaProperties;
    $extensions?: SchemaExtension[];
    $translations?: SchemaTranslations;
}

export type InlineSchema = Schema & any;

export type SchemaTranslations = { [k: string]: string | SchemaTranslations };

export type SchemaProperties = Record<string, SchemaProperty>;

export interface SchemaBaseProperty {
    [Token.Qualifications]?: SchemaPropertyValidator[];
    [Token.Validations]?: SchemaPropertyValidator[];
    [Token.DefaultValue]?: unknown;
    [Token.Enum]?: DirtySchemaPropertyEnum<unknown>[];
    [Token.Component]?: SchemaComponent;
    [key: string]: unknown;
}

export interface SchemaComponent {
    type?: string;
    subType?: string;
    title?: string;
    description?: string;
    legend?: string;
    placeholder?: string;
    label?: string;
    disqualificationBehavior?: "hide" | "disable";
}

export type SchemaProperty =
    | SchemaArrayProperty
    | SchemaBooleanProperty
    | SchemaObjectProperty
    | SchemaListBooleanProperty
    | SchemaListMixedProperty
    | SchemaListNumberProperty
    | SchemaListStringProperty
    | SchemaNullProperty
    | SchemaNumberProperty
    | SchemaStringProperty;

export interface SchemaArrayProperty extends SchemaBaseProperty {
    type: PropertyType.Array | "array";
    items: SchemaProperty;
    min?: number;
    max?: number;
}

export interface SchemaListBooleanProperty extends SchemaBaseProperty {
    type: PropertyType.ListBoolean | "list<boolean>";
}

export interface SchemaListNumberProperty extends SchemaBaseProperty {
    type: PropertyType.ListNumber | "list<number>";
}

export interface SchemaListMixedProperty extends SchemaBaseProperty {
    type: PropertyType.ListMixed | "list<mixed>";
}

export interface SchemaListStringProperty extends SchemaBaseProperty {
    type: PropertyType.ListString | "list<string>";
}

export interface SchemaBooleanProperty extends SchemaBaseProperty {
    type: PropertyType.Boolean | "boolean";
}

export interface SchemaObjectProperty extends SchemaBaseProperty {
    type: PropertyType.Object | "object";
    __: SchemaProperties;
}

export interface SchemaNullProperty extends SchemaBaseProperty {
    type: PropertyType.Null | "null";
}

export interface SchemaNumberProperty extends SchemaBaseProperty {
    type: PropertyType.Number | "number";
}

export interface SchemaStringProperty extends SchemaBaseProperty {
    type: PropertyType.String | "string";
}

export interface SchemaPropertyEnum<T> {
    value: T;
    label?: string;
    [key: string]: unknown;
}

type SchemaPropertyEnumValue<T> = T;

export type DirtySchemaPropertyEnum<T> =
    | SchemaPropertyEnum<T>
    | SchemaPropertyEnumValue<T>;
