import { isEmptyString } from "../common/helpers";
import { defaultConfig } from "../form/defaults";
import type { Form } from "../form/Form";
import type { ExtensionDefinition } from "../form/FormExtensions";
import type { FormConfig } from "../form/types";
import type { Schema } from "../schema/Schema";
import { Token } from "../schema/Tokens";
import { DataSelector } from "../selector/DataSelector";
import { Builder } from "./Builder";
import { processSchemaProps } from "./propsBuilder";

export const SchemaBuilderError = {
    InvalidPropertyKeyName: `Property key {key} cannot contain "${DataSelector.separator}" (dot)`,
    InvalidPropertyValue: `Property {key} is undefined in schema`,
    MissingRootProperties: `Schema must have a root properties key "${Token.Properties}"`,
    UnknownPropertyType: `Unknown property type`,
    UnknownPropertyTypeOf: `Unknown property type "{type}"`,
    ExtensionDuplicateId: `Extension with id "{id}" already exists`,
    ExtensionDuplicateName: `Extension with name "{name}" already exists, add a unique id to the extension definition`,
    ExtensionEmptyId: `Extension with name "{name}" has an empty id`,
} as const;

/**
 * Build a form instance from schema
 */
export class SchemaBuilder {
    async build(
        schema: Schema,
        config: Partial<FormConfig> = {},
    ): Promise<Form> {
        return await this._build(schema, config);
    }

    async buildEmpty(config: Partial<FormConfig> = {}): Promise<Form> {
        return this._build(
            {
                __: {},
            },
            config,
        );
    }

    private async _build(
        schema: Schema,
        config: Partial<FormConfig>,
    ): Promise<Form> {
        const builder = new Builder();
        if (!schema.__) {
            throw new Error(SchemaBuilderError.MissingRootProperties);
        }
        processSchemaProps(builder, schema.__, "root");

        const finalConfig = this.processConfig(schema, config);

        const extensions = this.processExtensions(
            schema[Token.SchemaExtensions],
        );

        return await builder.build(finalConfig, extensions);
    }

    public processExtensions(
        schemaExtensions: Schema[Token.SchemaExtensions],
    ): ExtensionDefinition[] {
        if (!schemaExtensions) {
            return [];
        }

        const extNames: string[] = [];
        const ids: string[] = [];
        const extensions: ExtensionDefinition[] = [];

        for (const extension of schemaExtensions) {
            const keys = Object.keys(extension);
            let name: string = "";
            if (keys.length === 1) {
                name = keys[0];
            }

            if (isEmptyString(extension[name].id)) {
                throw new Error(
                    SchemaBuilderError.ExtensionEmptyId.replace("{name}", name),
                );
            }

            if (extension[name].id) {
                if (ids.includes(extension[name].id)) {
                    throw new Error(
                        SchemaBuilderError.ExtensionDuplicateId.replace(
                            "{id}",
                            extension[name].id,
                        ),
                    );
                }
                ids.push(extension[name].id);
            } else if (extNames.includes(name)) {
                throw new Error(
                    SchemaBuilderError.ExtensionDuplicateName.replace(
                        "{name}",
                        name,
                    ),
                );
            } else {
                extNames.push(name);
            }

            extensions.push([name, extension[name]]);
        }

        return extensions;
    }

    private processConfig(
        schema: Schema,
        config: Partial<FormConfig>,
    ): FormConfig {
        const finalConfig = Object.assign({}, defaultConfig, config);
        finalConfig.vars = Object.assign(
            {},
            schema[Token.SchemaVars] || {},
            finalConfig.vars || {},
        );
        finalConfig.id = finalConfig.id || schema[Token.SchemaId] || "";
        return finalConfig;
    }
}
