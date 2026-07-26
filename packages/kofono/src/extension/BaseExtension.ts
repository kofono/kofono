import type { Form } from "../form/Form";
import type {
    Extension,
    ExtensionBaseOptions,
    ExtensionContext,
} from "./types";

export abstract class BaseExtension<
    TMetaData,
    TOptions extends ExtensionBaseOptions = ExtensionBaseOptions,
> implements Extension<TMetaData, TOptions>
{
    abstract metaData: TMetaData;
    abstract init(): Promise<void> | void;

    public constructor(
        protected ctx: ExtensionContext,
        public readonly opts: TOptions,
    ) {}

    public get form(): Form {
        return this.ctx.form;
    }

    public syncMetaData(): void {
        this.ctx.form.state.meta.extensions[this.metaIndex].data =
            structuredClone(this.metaData);
    }

    public get metaId(): string | undefined {
        return this.opts.id;
    }

    public get metaIndex(): number {
        return this.ctx.metaIndex;
    }

    public get metaName(): string {
        return this.ctx.metaName;
    }
}
