import { Factory } from "../common/factory";
import { objectHasKey } from "../common/helpers";
import { builtinExtensionFactories } from "./builtinExtensions";
import type { ExtensionBaseOptions, ExtensionFactoryHandler } from "./types";

export class ExtensionsFactory implements Factory<ExtensionFactoryHandler> {
    #extensions: Record<string, ExtensionFactoryHandler> = {
        ...builtinExtensionFactories,
    };

    get(name: string): ExtensionFactoryHandler {
        return this.#extensions[name];
    }

    has(name: string): boolean {
        return objectHasKey(this.#extensions, name);
    }

    register<TOptions extends ExtensionBaseOptions = ExtensionBaseOptions>(
        name: string,
        handler: ExtensionFactoryHandler<TOptions>,
    ): Factory<ExtensionFactoryHandler> {
        this.#extensions[name] = handler as unknown as ExtensionFactoryHandler;
        return this;
    }
}
