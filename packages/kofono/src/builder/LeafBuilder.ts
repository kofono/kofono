import { normalizeEnumDef } from "../property/enum";
import { Property } from "../property/Property";
import type { SchemaProperty } from "../schema/Schema";
import type { PropertyBuilder } from "./types";

export class LeafBuilder<TSchemaType extends SchemaProperty>
    implements PropertyBuilder<TSchemaType>
{
    public constructor(
        protected readonly uid: string,
        protected def: TSchemaType,
    ) {
        this.normalizeEnum();
    }

    build(): Property<TSchemaType> {
        return new Property<TSchemaType>(this.uid, this.def);
    }

    private normalizeEnum() {
        if (this.def.enum) {
            this.def.enum = normalizeEnumDef(this.def.enum);
        }
    }
}
