import { Property } from "../property/Property";
import type { SchemaProperty } from "../schema/Schema";
import type { PropertyBuilder } from "./types";

export class NodeBuilder<TSchemaType extends SchemaProperty>
    implements PropertyBuilder<TSchemaType>
{
    public constructor(
        protected readonly selector: string,
        protected def: TSchemaType,
    ) {}

    build(): Property<TSchemaType> {
        return new Property<TSchemaType>(this.selector, this.def);
    }
}
