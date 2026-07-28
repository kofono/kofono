import { PropertyType } from "./types";

export const allPropertyTypes: PropertyType[] = [
    PropertyType.Array,
    PropertyType.BigInt,
    PropertyType.Boolean,
    PropertyType.ListBigInt,
    PropertyType.ListBoolean,
    PropertyType.ListMixed,
    PropertyType.ListNumber,
    PropertyType.ListString,
    PropertyType.Null,
    PropertyType.Number,
    PropertyType.Object,
    PropertyType.String,
] as const;

export const answerablePropertyTypes: PropertyType[] = [
    PropertyType.BigInt,
    PropertyType.Boolean,
    PropertyType.ListBoolean,
    PropertyType.ListMixed,
    PropertyType.ListNumber,
    PropertyType.ListString,
    PropertyType.Number,
    PropertyType.String,
] as const;

export const nonAnswerablePropertyTypes: PropertyType[] = [
    PropertyType.Array,
    PropertyType.Null,
    PropertyType.Object,
] as const;

export const arrayPropertyTypes: PropertyType[] = [
    PropertyType.Array,
    PropertyType.ListBigInt,
    PropertyType.ListBoolean,
    PropertyType.ListMixed,
    PropertyType.ListNumber,
    PropertyType.ListString,
] as const;
