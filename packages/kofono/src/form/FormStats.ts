import { TreeType } from "../property/types";
import { Events } from "./events/types";
import type { Form } from "./Form";
import type { Stats } from "./types";

export class FormStats {
    private cachedPropsEntries: [string, TreeType][] = [];

    constructor(private form: Form) {
        this.cacheProps();
    }

    public compile(): Stats {
        const stats: Stats = {
            qualified: 0,
            valid: 0,
            invalid: 0,
            progression: 0,
            node: 0,
            leaf: 0,
        };

        for (const prop of this.cachedPropsEntries) {
            if (prop[1] === TreeType.Node) {
                stats.node += 1;
                continue;
            }

            stats.leaf += 1;
            stats.qualified += Number(
                this.form.state.qualifications[prop[0]][0],
            );
            stats.valid += Number(this.form.state.validations[prop[0]][0]);
        }

        stats.invalid = stats.qualified - stats.valid;
        stats.progression =
            stats.qualified > 0
                ? ((stats.valid / stats.qualified) * 100 + 0.5) | 0
                : 0;

        this.form.state.stats = stats;

        return stats;
    }

    public async init() {
        this.form.events.on(Events.PropertyAdded, ctx => {
            this.cachedPropsEntries.push([
                ctx.selector,
                this.form.rawProp(ctx.selector).treeType,
            ]);
            this.compile();
        });

        this.form.events.on(Events.PropertyDeleted, ctx => {
            this.cachedPropsEntries = this.cachedPropsEntries.filter(
                p => p[0] !== ctx.selector,
            );
            this.compile();
        });
    }

    private cacheProps() {
        for (const [sel, prop] of Object.entries(this.form.props)) {
            this.cachedPropsEntries.push([sel, prop.treeType]);
        }
    }
}
