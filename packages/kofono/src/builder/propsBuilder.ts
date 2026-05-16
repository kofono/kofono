import { isObjectLiteral } from "../common/helpers";
import type { Properties } from "../form/types";
import { PropertyType } from "../property/types";
import type { SchemaProperties, SchemaProperty } from "../schema/Schema";
import { DataSelector } from "../selector/DataSelector";
import { joinParentSelector } from "../selector/helpers";
import { Builder } from "./Builder";
import { SchemaBuilderError } from "./SchemaBuilder";

export function buildProps(
    id: string,
    prop: SchemaProperty,
    parentUid: string,
): Properties {
    const builder = new Builder();
    processSchemaProp(id, builder, prop, parentUid);
    return builder.buildProps();
}

export function processSchemaProps(
    builder: Builder,
    schema: SchemaProperties,
    parentUid: string,
): void {
    for (const [propId, prop] of Object.entries(schema)) {
        if (typeof propId !== "string") {
            continue;
        }

        if (!isObjectLiteral(prop)) {
            throw new Error(
                SchemaBuilderError.InvalidPropertyValue.replace(
                    "{key}",
                    propId,
                ),
            );
        } else if ("type" in prop) {
            processSchemaProp(propId, builder, prop, parentUid);
        }
    }
}

function processSchemaProp(
    key: string,
    builder: Builder,
    prop: SchemaProperty,
    parentUid: string,
): void {
    if (key.includes(DataSelector.separator)) {
        throw new Error(
            SchemaBuilderError.InvalidPropertyKeyName.replace("{key}", key),
        );
    }

    const selector = joinParentSelector(parentUid, key);
    switch (prop.type) {
        case PropertyType.Array:
            builder.array(selector, prop);
            return;
        case PropertyType.ListBoolean:
            builder.listBoolean(selector, prop);
            return;
        case PropertyType.ListMixed:
            builder.listMixed(selector, prop);
            return;
        case PropertyType.ListNumber:
            builder.listNumber(selector, prop);
            return;
        case PropertyType.ListString:
            builder.listString(selector, prop);
            return;
        case PropertyType.Boolean:
            builder.boolean(selector, prop);
            return;
        case PropertyType.Object:
            builder.object(selector, prop);
            processSchemaProps(builder, prop.__, selector);
            return;
        case PropertyType.Null:
            builder.null(selector, prop);
            return;
        case PropertyType.Number:
            builder.number(selector, prop);
            return;
        case PropertyType.String:
            builder.string(selector, prop);
            return;
    }

    if (typeof (prop as SchemaProperty).type === "string") {
        throw new Error(
            SchemaBuilderError.UnknownPropertyTypeOf.replace(
                "{type}",
                (prop as SchemaProperty).type,
            ),
        );
    }

    throw new Error(SchemaBuilderError.UnknownPropertyType);
}
