import type { GenericValidatorOptions } from "../validator/types";

export enum PropertyType {
    Array = "array",
    Boolean = "boolean",
    Object = "object",
    ListBoolean = "list<boolean>",
    ListMixed = "list<mixed>",
    ListNumber = "list<number>",
    ListString = "list<string>",
    Null = "null",
    Number = "number",
    String = "string",
    Unknown = "unknown",
}

export type PropertyValidator = {
    name: string;
    options: GenericValidatorOptions;
};

export enum TreeType {
    Leaf = "leaf",
    Node = "node",
}

export interface BaseProperty<T> {
    readonly type: PropertyType;
    readonly treeType: TreeType;
    readonly selector: string;

    def(): T;
    get<T>(defKeyPath: string, defaultValue: unknown): T;
    has(defKeyPath: string): boolean;
    renameSelector(selector: string): void;
    validators(): PropertyValidator[];
    qualifiers(): PropertyValidator[];
}
