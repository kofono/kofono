import type { Form } from "../form/Form";

export interface Extension<
    TMetaData = unknown,
    TOptions extends ExtensionBaseOptions = ExtensionBaseOptions,
> {
    metaData: TMetaData;
    metaId?: string;
    metaIndex: number;
    metaName: string;
    opts: TOptions;
    init(): Promise<void> | void;
}

export type ExtensionContext = {
    form: Form;
    metaIndex: number;
    metaName: string;
};

export type ExtensionFactoryHandler<
    TOptions extends ExtensionBaseOptions = ExtensionBaseOptions,
> = (
    ctx: ExtensionContext,
    opts: TOptions,
) => Promise<Extension<unknown, TOptions>> | Extension<unknown, TOptions>;

export type ExtensionBaseOptions = {
    id?: string;
};

export type MetaExtension = {
    id?: string;
    name: string;
    data: any;
};
