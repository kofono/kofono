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

    #validationValidators: PropertyValidator[];
    #qualificationValidators: PropertyValidator[];
    #defQuerier: GenericDataQuerier;
    #selector: string = "";
    #def: TSchemaType;

    constructor(selector: string, def: TSchemaType) {
        const [type, treeType] = determinePropertyTypes(def.type);
        if (type === PropertyType.Unknown) {
            throw new Error(`Unknown type: ${def.type}`);
        }
        this.type = type;
        this.treeType = treeType;

        this.#selector = selector;
        this.#def = def;
        this.#defQuerier = new GenericDataQuerier(this.#def);

        this.#validationValidators = parseValidators(
            this.get(Token.Validations, []),
        );
        this.#qualificationValidators = parseValidators(
            this.get(Token.Qualifications, []),
        );
    }

    public set selector(selector: string) {
        const [isValid, errorMessage] = validateSelector(selector);
        if (!isValid) {
            throw new Error(errorMessage);
        }
        this.#selector = selector;
    }

    public get selector(): string {
        return this.#selector;
    }

    public get validationValidators(): PropertyValidator[] {
        return this.#validationValidators;
    }

    public get qualificationValidators(): PropertyValidator[] {
        return this.#qualificationValidators;
    }

    public get<T>(defKeyPath: string, defaultValue: unknown = null): T {
        return this.#defQuerier.getOrDefault<T>(defKeyPath, defaultValue as T);
    }

    public has(defKeyPath: string): boolean {
        return this.#defQuerier.has(defKeyPath);
    }

    public def(): TSchemaType {
        return this.#def as TSchemaType;
    }
}
