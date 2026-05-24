import type { SchemaProperty } from "../schema/Schema";
import { Token } from "../schema/Tokens";
import { GenericDataQuerier } from "../selector/GenericDataQuerier";
import { validateSelector } from "./helpers";
import { determinePropertyTypes, parseValidators } from "./parser";
import {
    type BaseProperty,
    PropertyType,
    type PropertyValidator,
    type TreeType,
} from "./types";

export class Property<TSchemaType extends SchemaProperty>
    implements BaseProperty<TSchemaType>
{
    public readonly type: PropertyType;
    public readonly treeType: TreeType;

    #validators: PropertyValidator[];
    #qualifiers: PropertyValidator[];
    #defQuerier: GenericDataQuerier;
    #selector: string;
    #def: TSchemaType;

    constructor(selector: string, def: TSchemaType) {
        mustBeValidSelectorName(selector);
        this.#selector = selector;

        const [type, treeType] = determinePropertyTypes(def.type);
        if (type === PropertyType.Unknown) {
            throw new Error(`Unknown type: ${def.type}`);
        }
        this.type = type;
        this.treeType = treeType;

        this.#def = def;
        this.#defQuerier = new GenericDataQuerier(def);
        this.#validators = parseValidators(def[Token.Validations] ?? []);
        this.#qualifiers = parseValidators(def[Token.Qualifications] ?? []);
    }

    public get selector(): string {
        return this.#selector;
    }

    public def(): TSchemaType {
        return this.#def as TSchemaType;
    }

    public get<T>(defKeyPath: string, defaultValue: unknown = null): T {
        return this.#defQuerier.getOrDefault<T>(defKeyPath, defaultValue as T);
    }

    public has(defKeyPath: string): boolean {
        return this.#defQuerier.has(defKeyPath);
    }

    public qualifiers(): PropertyValidator[] {
        return this.#qualifiers;
    }

    public renameSelector(selector: string) {
        mustBeValidSelectorName(selector);
        this.#selector = selector;
    }

    public validators(): PropertyValidator[] {
        return this.#validators;
    }
}

function mustBeValidSelectorName(selector: string) {
    const [isValid, errorMessage] = validateSelector(selector);
    if (!isValid) {
        throw new Error(errorMessage);
    }
}
