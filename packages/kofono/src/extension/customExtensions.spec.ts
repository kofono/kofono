import { describe, expect, it } from "vitest";
import { K } from "../builder/K";
import type { FormConfig } from "../form/types";
import { BaseExtension } from "./BaseExtension";
import type { ExtensionBaseOptions } from "./types";

type CustomExtensionMeta = {
    value: string;
};

interface CustomExtensionOpts extends ExtensionBaseOptions {
    param1: string;
    param2: string;
}

class CustomExtension extends BaseExtension<
    CustomExtensionMeta,
    CustomExtensionOpts
> {
    metaData: CustomExtensionMeta = {
        value: "",
    };

    async init(): Promise<void> {}
}

// just a helper to build the schema
function custom(id: string, param1: string, param2: string) {
    return {
        custom: {
            id,
            param1,
            param2,
        },
    };
}

describe("Custom extension", () => {
    it("custom extension basic implementation", async () => {
        const config: Partial<FormConfig> = {
            init: ctx => {
                ctx.addExtension<CustomExtensionOpts>(
                    "custom",
                    async (ctx, opts) => {
                        return new CustomExtension(ctx, opts);
                    },
                );
            },
        };

        const form = await K.form(
            {
                $extensions: [custom("id", "ok", "foo")],
                name: K.string(),
            },
            config,
        );

        const extInstance = form.extensions.getByIndex(0);
        expect(extInstance).toBeDefined();
        expect(extInstance?.metaIndex).toBe(0);
        expect(extInstance?.metaId).toBe("id");
        expect(extInstance?.metaName).toBe("custom");
        expect(extInstance?.metaData).toEqual({
            value: "",
        });
    });
});
