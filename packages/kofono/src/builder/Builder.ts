import { defaultConfig } from "../form/defaults";
import { Form } from "../form/Form";
import type { ExtensionDefinition } from "../form/FormExtensions";
import type { BaseProperties, FormConfig } from "../form/types";
import { PropertyType } from "../property/types";
import type {
    SchemaArrayProperty,
    SchemaBigIntProperty,
    SchemaBooleanProperty,
    SchemaListBigIntProperty,
    SchemaListBooleanProperty,
    SchemaListMixedProperty,
    SchemaListNumberProperty,
    SchemaListStringProperty,
    SchemaNullProperty,
    SchemaNumberProperty,
    SchemaObjectProperty,
    SchemaProperty,
    SchemaStringProperty,
} from "../schema/Schema";
import { LeafBuilder } from "./LeafBuilder";
import { NodeBuilder } from "./NodeBuilder";
import type { PropertyBuilder } from "./types";

export class DuplicatePropertySelectorError extends Error {
    constructor(selector: string) {
        super(`Duplicate property selector: ${selector}`);
    }
}

export class Builder {
    protected _builders: Record<string, PropertyBuilder<SchemaProperty>> = {};
    protected _selectors: string[] = [];

    public async build(
        config: FormConfig = defaultConfig,
        extensions: ExtensionDefinition[] = [],
    ): Promise<Form> {
        const properties = this.buildProps();

        const form = new Form(config, properties);
        await form.init({
            state: config.state,
            init: config.init,
            extensions,
        });
        return form;
    }

    public get selectors(): string[] {
        return this._selectors;
    }

    public buildProps(): BaseProperties {
        const props: BaseProperties = {};
        for (const builder of Object.values(this._builders)) {
            const prop = builder.build();
            props[prop.selector] = prop;
        }
        return props;
    }

    array(selector: string, def: Omit<SchemaArrayProperty, "type">): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaArrayProperty = {
            ...(def as SchemaArrayProperty),
            type: PropertyType.Array,
        };
        this._builders[selector] = new LeafBuilder<SchemaArrayProperty>(
            selector,
            typedDef,
        );
    }

    bigInt(selector: string, def: Omit<SchemaBigIntProperty, "type">): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaBigIntProperty = {
            type: PropertyType.BigInt,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaBigIntProperty>(
            selector,
            typedDef,
        );
    }

    boolean(selector: string, def: Omit<SchemaBooleanProperty, "type">): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaBooleanProperty = {
            type: PropertyType.Boolean,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaBooleanProperty>(
            selector,
            typedDef,
        );
    }

    listBigInt(
        selector: string,
        def: Omit<SchemaListBigIntProperty, "type">,
    ): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaListBigIntProperty = {
            type: PropertyType.ListBigInt,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaListBigIntProperty>(
            selector,
            typedDef,
        );
    }

    listBoolean(
        selector: string,
        def: Omit<SchemaListBooleanProperty, "type">,
    ): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaListBooleanProperty = {
            type: PropertyType.ListBoolean,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaListBooleanProperty>(
            selector,
            typedDef,
        );
    }

    listMixed(
        selector: string,
        def: Omit<SchemaListMixedProperty, "type">,
    ): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaListMixedProperty = {
            type: PropertyType.ListMixed,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaListMixedProperty>(
            selector,
            typedDef,
        );
    }

    listNumber(
        selector: string,
        def: Omit<SchemaListNumberProperty, "type">,
    ): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaListNumberProperty = {
            type: PropertyType.ListNumber,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaListNumberProperty>(
            selector,
            typedDef,
        );
    }

    listString(
        selector: string,
        def: Omit<SchemaListStringProperty, "type">,
    ): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaListStringProperty = {
            type: PropertyType.ListString,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaListStringProperty>(
            selector,
            typedDef,
        );
    }

    null(selector: string, def: Omit<SchemaNullProperty, "type">): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaNullProperty = {
            type: PropertyType.Null,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaNullProperty>(
            selector,
            typedDef,
        );
    }

    number(selector: string, def: Omit<SchemaNumberProperty, "type">): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaNumberProperty = {
            type: PropertyType.Number,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaNumberProperty>(
            selector,
            typedDef,
        );
    }

    object(selector: string, def: Omit<SchemaObjectProperty, "type">): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaObjectProperty = {
            ...(def as SchemaObjectProperty),
            type: PropertyType.Object,
        };
        this._builders[selector] = new NodeBuilder<SchemaObjectProperty>(
            selector,
            typedDef,
        );
    }

    string(selector: string, def: Omit<SchemaStringProperty, "type">): void {
        this.validateSelectorOrThrow(selector);

        const typedDef: SchemaStringProperty = {
            type: PropertyType.String,
            ...def,
        };
        this._builders[selector] = new LeafBuilder<SchemaStringProperty>(
            selector,
            typedDef,
        );
    }

    protected trackSelector(selector: string): boolean {
        if (this._selectors.includes(selector)) {
            return false;
        }
        this._selectors.push(selector);
        return true;
    }

    protected validateSelectorOrThrow(selector: string): void {
        if (!this.trackSelector(selector)) {
            throw new DuplicatePropertySelectorError(selector);
        }
    }
}
