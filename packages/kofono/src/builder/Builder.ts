import { defaultConfig } from "../form/defaults";
import { Form } from "../form/Form";
import type { ExtensionDefinition } from "../form/FormExtensions";
import type { BaseProperties, FormConfig } from "../form/types";
import { PropertyType } from "../property/types";
import type {
    SchemaArrayProperty,
    SchemaBooleanProperty,
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
import { DuplicatePropertyUidError } from "./Errors";
import { LeafBuilder } from "./LeafBuilder";
import { NodeBuilder } from "./NodeBuilder";
import type { PropertyBuilder } from "./types";

export class Builder {
    protected _builders: Record<string, PropertyBuilder<SchemaProperty>> = {};
    protected _uids: string[] = [];
    protected _errors: Error[] = [];
    //protected _uid: string = "root";

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

    public buildProps(): BaseProperties {
        const props: BaseProperties = {};
        for (const builder of Object.values(this._builders)) {
            const prop = builder.build();
            props[prop.selector] = prop;
        }
        return props;
    }

    array(uid: string, def: Omit<SchemaArrayProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaArrayProperty = {
            ...(def as SchemaArrayProperty),
            type: PropertyType.Array,
        };
        this._builders[uid] = new LeafBuilder<SchemaArrayProperty>(
            uid,
            typedDef,
        );
    }

    listBoolean(
        uid: string,
        def: Omit<SchemaListBooleanProperty, "type">,
    ): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaListBooleanProperty = {
            type: PropertyType.ListBoolean,
            ...def,
        };
        this._builders[uid] = new LeafBuilder<SchemaListBooleanProperty>(
            uid,
            typedDef,
        );
    }

    listNumber(uid: string, def: Omit<SchemaListNumberProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaListNumberProperty = {
            type: PropertyType.ListNumber,
            ...def,
        };
        this._builders[uid] = new LeafBuilder<SchemaListNumberProperty>(
            uid,
            typedDef,
        );
    }

    listMixed(uid: string, def: Omit<SchemaListMixedProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaListMixedProperty = {
            type: PropertyType.ListMixed,
            ...def,
        };
        this._builders[uid] = new LeafBuilder<SchemaListMixedProperty>(
            uid,
            typedDef,
        );
    }

    listString(uid: string, def: Omit<SchemaListStringProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaListStringProperty = {
            type: PropertyType.ListString,
            ...def,
        };
        this._builders[uid] = new LeafBuilder<SchemaListStringProperty>(
            uid,
            typedDef,
        );
    }

    boolean(uid: string, def: Omit<SchemaBooleanProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaBooleanProperty = {
            type: PropertyType.Boolean,
            ...def,
        };
        this._builders[uid] = new LeafBuilder<SchemaBooleanProperty>(
            uid,
            typedDef,
        );
    }

    object(uid: string, def: Omit<SchemaObjectProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaObjectProperty = {
            ...(def as SchemaObjectProperty),
            type: PropertyType.Object,
        };
        this._builders[uid] = new NodeBuilder<SchemaObjectProperty>(
            uid,
            typedDef,
        );
    }

    null(uid: string, def: Omit<SchemaNullProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaNullProperty = {
            type: PropertyType.Null,
            ...def,
        };
        this._builders[uid] = new LeafBuilder<SchemaNullProperty>(
            uid,
            typedDef,
        );
    }

    number(uid: string, def: Omit<SchemaNumberProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaNumberProperty = {
            type: PropertyType.Number,
            ...def,
        };
        this._builders[uid] = new LeafBuilder<SchemaNumberProperty>(
            uid,
            typedDef,
        );
    }

    string(uid: string, def: Omit<SchemaStringProperty, "type">): void {
        if (!this.validateUid(uid)) {
            return;
        }
        const typedDef: SchemaStringProperty = {
            type: PropertyType.String,
            ...def,
        };
        this._builders[uid] = new LeafBuilder<SchemaStringProperty>(
            uid,
            typedDef,
        );
    }

    public validateUid(uid: string): boolean {
        if (this._uids.includes(uid)) {
            this._errors.push(new DuplicatePropertyUidError(uid));
            return false;
        }
        this._uids.push(uid);
        return true;
    }

    public errors(): Error[] {
        return this._errors;
    }

    public uids(): string[] {
        return this._uids;
    }
}
