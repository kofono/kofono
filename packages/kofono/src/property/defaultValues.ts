import { PropertyType } from "./types";

export const propertyTypeDefaultValues = Object.freeze({
    [PropertyType.Array]: [],
    [PropertyType.BigInt]: BigInt(0),
    [PropertyType.Boolean]: false,
    [PropertyType.ListBigInt]: [],
    [PropertyType.ListBoolean]: [],
    [PropertyType.ListNumber]: [],
    [PropertyType.ListString]: [],
    [PropertyType.ListMixed]: [],
    [PropertyType.Null]: null,
    [PropertyType.Number]: 0,
    [PropertyType.Object]: {},
    [PropertyType.String]: "",
});
