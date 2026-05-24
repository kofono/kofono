import { objectHasKey } from "../common/helpers";
import { arrayPropertyTypes } from "../property/categories";
import { type BaseProperty, PropertyType } from "../property/types";
import type { SchemaProperty } from "../schema/Schema";
import { DataSelector } from "../selector/DataSelector";
import { removeSelectorBase } from "../selector/helpers";
import type { BaseProperties, Data } from "./types";

export function generateTree(props: BaseProperties): Data {
    const data: Data = {};
    const selector = new DataSelector();
    for (const [uid, prop] of Object.entries(props)) {
        const value = getPropertyValue(prop);
        if (prop.type !== PropertyType.Null) {
            selector.set(uid, value, data);
        }
    }
    return data;
}

export function generatePartialTree(
    props: BaseProperties,
    baseSelector: string,
): Data {
    const data: Data = {};
    const selector = new DataSelector();
    for (const [uid, prop] of Object.entries(props)) {
        if (prop.type !== PropertyType.Null) {
            selector.set(
                removeSelectorBase(baseSelector, uid),
                getPropertyValue(prop),
                data,
            );
        }
    }
    return data;
}

function getPropertyValue(prop: BaseProperty<SchemaProperty>): unknown {
    if (prop.type === PropertyType.Object) {
        return {};
    } else if (objectHasKey(prop.def(), "default")) {
        return prop.def().default;
    } else if (arrayPropertyTypes.includes(prop.type)) {
        return [];
    }
    return null;
}
