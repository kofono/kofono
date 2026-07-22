import { PropertyType } from "./types";

export const propertyTypeDefaultValues = Object.freeze({
    [PropertyType.Array]: [],
    [PropertyType.Boolean]: false,
    [PropertyType.Number]: 0,
    [PropertyType.String]: "",
    [PropertyType.Object]: {},
    [PropertyType.ListBoolean]: [],
    [PropertyType.ListNumber]: [],
    [PropertyType.ListString]: [],
    [PropertyType.ListMixed]: [],
    [PropertyType.Null]: null,
});
