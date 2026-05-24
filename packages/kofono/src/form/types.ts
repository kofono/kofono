import type { ExtensionsFactory } from "../extension/ExtensionsFactory";
import type { MetaExtension } from "../extension/types";
import type { BaseProperty } from "../property/types";
import type { SchemaProperty } from "../schema/Schema";
import type { ValidatorResponse } from "../validator/types";
import type { ValidatorsFactory } from "../validator/ValidatorsFactory";
import type { Form } from "./Form";
import type { ExtensionDefinition } from "./FormExtensions";
import type { FormInitContext } from "./FormInitContext";
import type { FormProperty } from "./FormProperty";

export enum FormStatus {
    Init = "init",
    Ready = "ready",
    Error = "error",
}

export enum FormEnv {
    dev = "dev",
    prod = "prod",
    test = "test",
}

export type FormConfig = FormInitConfig & {
    id?: string;
    env: FormEnv;
    vars: Record<string, unknown>;
    passHandler: PassHandler;
    validatorsFactory: ValidatorsFactory;
    extensionsFactory: ExtensionsFactory;
};

export type FormInitConfig = {
    state?: Partial<State>;
    init?: (ctx: FormInitContext) => Promise<void> | void;
    extensions?: ExtensionDefinition[];
};

export type BaseProperties = Record<string, BaseProperty<SchemaProperty>>;
export type FormProperties = Record<string, FormProperty>;

export type Data = Record<string, any>;

export interface Meta {
    hasBeenUpdated: string[];
    extensions: MetaExtension[];
}

export type Stats = {
    qualified: number; // note: only take into account leaf properties
    valid: number; // note: only take into account leaf properties
    invalid: number; // note: only take into account leaf properties
    progression: number | string;
    node: number;
    leaf: number;
};

export type Env = "dev" | "prod" | "test" | "debug" | "trace" | "silent";

export type State = {
    sessionId: string; // unique id of the form
    data: Data; // data of the form
    stats: Stats; // stats of the form
    meta: Meta; // extra data related to the form
    pass: ValidatorResponse; // pass handler response for the form
    qualifications: Record<string, ValidatorResponse>; // selector qualifications of the form
    validations: Record<string, ValidatorResponse>; // selector validations of the form
};

export type PropertyState = {
    data: any;
    isValid: boolean;
    isQualified: boolean;
    validationError: string;
    qualificationError: string;
};

export type PassHandler = (form: Form) => ValidatorResponse;

export type UpdateType = Update.Normal | Update.ResetQualification;
export enum Update {
    Normal = "normal",
    ResetQualification = "resetQualification",
}
