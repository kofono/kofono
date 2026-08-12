import { Events } from "../../form/events/types";
import { BaseExtension } from "../BaseExtension";
import type { ExtensionBaseOptions, ExtensionContext } from "../types";

// represent the schema structure definition
export type SchemaScoringExtension =
    | "scoring"
    | {
          scoring: ScoringOpts;
      };

// represent the options passed to the extension at form creation.
export type ScoringOpts = ExtensionBaseOptions & {
    keyName?: string; // property score key name (default: "score"
    defaultScoreValue?: number; // default score value, (default: 0)
};

// represent the extension meta-state shape/type
export type ScoringMeta = {
    total: number;
    max: number;
    selectors: Record<string, number>;
};

// represent the extension declaration and factory
export const scoringExtension = {
    name: "scoring" as const,
    factory: (ctx: ExtensionContext, opts: ScoringOpts) =>
        new ScoringExtension(ctx, opts),
};

// function to build the schema definition
export function scoring(opts: ScoringOpts = {}): SchemaScoringExtension {
    return {
        scoring: {
            ...opts,
        },
    };
}

/**
 * Scoring extension
 * ex:
 * ```ts
 * K.schema({
 *     $extensions: ["scoring"],
 *     propA: K.string().set("score", 1),
 *     propB: K.string().set("score", 2),
 *     propC: K.string(),
 * });
 * ```
 */
export class ScoringExtension extends BaseExtension<ScoringMeta, ScoringOpts> {
    public readonly metaData: ScoringMeta = {
        total: 0,
        max: 0,
        selectors: {},
    };

    private readonly keyName: string;
    private readonly defaultScoreValue: number;

    constructor(ctx: ExtensionContext, opts: ScoringOpts = {}) {
        super(ctx, opts);
        this.keyName = opts.keyName || "score";
        this.defaultScoreValue = opts.defaultScoreValue || 0;
    }

    async init(): Promise<void> {
        // prepopulate selectors and compilate data on form ready
        this.ctx.form.events.on(Events.FormReady, () => {
            for (const selector of this.ctx.form.propsKeys()) {
                this.metaData.selectors[selector] =
                    this.getPropertyCurrentScore(selector);
            }
            this.compileMetaData();
        });

        // update selector score on update
        this.ctx.form.events.on(Events.SelectorAfterUpdate, ctx => {
            this.metaData.selectors[ctx.selector] =
                this.getPropertyCurrentScore(ctx.selector);
            this.compileMetaData();
        });

        // update selector score on property added
        this.ctx.form.events.on(Events.PropertyAdded, ctx => {
            this.metaData.selectors[ctx.selector] =
                this.getPropertyCurrentScore(ctx.selector);
            this.compileMetaData();
        });

        // remove selector score on property deleted
        this.ctx.form.events.on(Events.PropertyDeleted, ctx => {
            delete this.metaData.selectors[ctx.selector];
            this.compileMetaData();
        });
    }

    /**
     * Compile metadata and sync it with form state meta
     */
    private compileMetaData() {
        let total = 0;
        let max = 0;
        for (const [selector, val] of Object.entries(this.metaData.selectors)) {
            total += val;
            max += this.metaData.selectors[selector];
        }
        this.metaData.total = total;
        this.metaData.max = max;
        this.syncMetaData();
    }

    /**
     * Get the current property score base on its validation(s) and qualification(s)
     */
    private getPropertyCurrentScore(selector: string): number {
        const prop = this.ctx.form.prop(selector);
        if (
            !prop.isQualified() ||
            !prop.isParentsQualified() ||
            !prop.isValid()
        ) {
            return this.defaultScoreValue;
        }

        return this.getPropertyDefaultScore(selector);
    }

    private getPropertyDefaultScore(selector: string): number {
        return this.ctx.form
            .prop(selector)
            .get<number>(this.keyName, this.defaultScoreValue);
    }
}
