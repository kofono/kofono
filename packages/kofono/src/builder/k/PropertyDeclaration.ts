import { normalizeEnumDef } from "../../property/enum";
import type { PropertyType } from "../../property/types";
import type {
    DirtySchemaPropertyEnum,
    SchemaComponent,
    SchemaProperty,
} from "../../schema/Schema";
import type { SchemaPropertyValidator } from "../../validator/schema";
import { PropertyValidations } from "./PropertyValidations";

export class PropertyDeclaration<T = any> {
    constructor(public def: SchemaProperty) {}

    public static create<T>(
        type: PropertyType,
        validators: SchemaPropertyValidator[] = [],
    ): PropertyDeclaration<T> {
        const prop = new PropertyDeclaration({ type } as SchemaProperty);
        prop.validations(...validators);
        return prop;
    }

    public type(type: Omit<PropertyType, "unknown">): PropertyDeclaration {
        this.def.type = type as SchemaProperty["type"];
        return this;
    }

    public enum(
        options: DirtySchemaPropertyEnum<unknown>[],
    ): PropertyDeclaration {
        this.def.enum = normalizeEnumDef(options);
        return this;
    }

    // old chained way of adding validations
    // @deprecated should be deleted in 0.9
    public $v(
        fn: (v: PropertyValidations) => PropertyValidations,
    ): PropertyDeclaration {
        if (!this.def.$v) {
            this.def.$v = [];
        }
        this.def.$v = [...this.def.$v, ...fn(new PropertyValidations()).def];
        return this;
    }

    public validations(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration {
        if (validators.length === 0) {
            return this;
        }

        this.def.$v = Array.isArray(this.def.$v)
            ? [...this.def.$v, ...validators]
            : validators;

        return this;
    }

    // old chained way of adding qualifications
    // @deprecated should be deleted in 0.9
    public $q(
        fn: (q: PropertyValidations) => PropertyValidations,
    ): PropertyDeclaration {
        if (!this.def.$q) {
            this.def.$q = [];
        }
        this.def.$q = [...this.def.$q, ...fn(new PropertyValidations()).def];
        return this;
    }

    public qualifications(
        ...validators: SchemaPropertyValidator[]
    ): PropertyDeclaration {
        if (validators.length === 0) {
            return this;
        }

        this.def.$q = Array.isArray(this.def.$q)
            ? [...this.def.$q, ...validators]
            : validators;
        return this;
    }

    public set(key: string, value: any): PropertyDeclaration {
        this.def[key] = value;
        return this;
    }

    public props(props: Record<string, any>): PropertyDeclaration {
        this.def = Object.assign({}, this.def, props);
        return this;
    }

    public component<T extends SchemaComponent>(value: T): PropertyDeclaration {
        return this.set("component", value);
    }

    public default(value: T): PropertyDeclaration {
        return this.set("default", value);
    }
}
