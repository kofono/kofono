import { isEmptyString } from "../common/helpers";
import type {
    Extension,
    ExtensionBaseOptions,
    ExtensionContext,
} from "../extension/types";
import type { Form } from "./Form";

export type ExtensionDefinition = [name: string, options: any];

export class FormExtensions {
    #extensions: Extension[] = [];

    constructor(private form: Form) {}

    public get extensions(): Extension[] {
        return this.#extensions;
    }

    public get length(): number {
        return this.#extensions.length;
    }

    public getByIndex<TMetaData, TOptions extends ExtensionBaseOptions>(
        index: number,
    ): Extension<TMetaData, TOptions> | undefined {
        const ext = this.#extensions.find(ext => ext.metaIndex === index);
        if (!ext) {
            return undefined;
        }
        return ext as Extension<TMetaData, TOptions>;
    }

    public getById<TMetaData, TOptions extends ExtensionBaseOptions>(
        id: string,
    ): Extension<TMetaData, TOptions> | undefined {
        const ext = this.#extensions.find(ext => ext.metaId === id);
        if (!ext) {
            return undefined;
        }
        return ext as Extension<TMetaData, TOptions>;
    }

    /**
     * Builds the extensions from the provided definitions.
     */
    public async build(extensions: ExtensionDefinition[]) {
        const extensionInstances: Extension[] = [];

        for (const [name, opts] of extensions) {
            if (this.form.extensionsFactory.has(name)) {
                const extFactory = this.form.extensionsFactory.get(name);
                const extContext: ExtensionContext = {
                    form: this.form,
                    metaName: name,
                    metaIndex: this.getMetaIndex(name, opts.id),
                };

                const ext = await extFactory(extContext, opts);

                this.initMetaData(ext);
                await ext.init();

                extensionInstances.push(ext);
            }
        }

        this.#extensions.push(...extensionInstances);
    }

    /**
     * Get metadata array index for extension
     */
    private getMetaIndex(
        name: string,
        id: string | undefined = undefined,
    ): number {
        if (this.form.state.meta.extensions.length < 1) {
            return 0;
        }

        if (id && !isEmptyString(id)) {
            const index = this.form.state.meta.extensions.findIndex(
                x => x.id === id && x.name === name,
            );
            if (index !== -1) {
                // found existing matching extension state
                return index;
            }

            // existing state not found, put it at the end
            return this.form.state.meta.extensions.length;
        } else if (id === undefined) {
            const index = this.form.state.meta.extensions.findIndex(
                x => x.name === name && x.id === undefined,
            );
            if (index !== -1) {
                // found existing matching extension state
                return index;
            }

            // existing state not found, put it at the end
            return this.form.state.meta.extensions.length;
        }

        return 0;
    }

    /**
     * Create a new form state metadata or take current state
     * data and copy it to extension metadata
     */
    private initMetaData(ext: Extension): void {
        // create new state meta-extension state data
        if (!this.form.state.meta.extensions[ext.metaIndex]) {
            this.form.state.meta.extensions[ext.metaIndex] = {
                id: ext.metaId,
                name: ext.metaName,
                data: structuredClone(ext.metaData),
            };
        } else {
            // take current state data and copy it to extension metadata
            ext.metaData = structuredClone(
                this.form.state.meta.extensions[ext.metaIndex].data,
            );
        }
    }
}
