import type { BaseProperties } from "../types";
import { Events, type SelectorsEventsValidators } from "./types";

/**
 * Transform all properties validators into SelectorsEventsValidators
 */
export function parseSelectorsEventsValidators(
    props: BaseProperties,
    _parent: string = "", // todo remove it eventually
): SelectorsEventsValidators {
    const propertiesEvents: SelectorsEventsValidators = {};
    for (const prop of Object.values(props)) {
        propertiesEvents[prop.selector] = {
            [Events.SelectorValidation]: [],
            [Events.SelectorQualification]: [],
        };

        propertiesEvents[prop.selector][Events.SelectorValidation] =
            prop.validators();
        propertiesEvents[prop.selector][Events.SelectorQualification] =
            prop.qualifiers();
    }
    return propertiesEvents;
}
