// import { SchemaBasics } from "@/doc/schema.basics";
// import { SchemaProperties } from "@/doc/schema.properties";
// import { SchemaSelectors } from "@/doc/schema.selectors";
// import { ValidatorList } from "@/doc/validator.list";

import { FirstForm } from "@/doc/first-form.meta";
import { FirstSchema } from "@/doc/first-schema.meta";
// import { Playground } from "@/pages/playground";
// import { Theme } from "@/pages/theme";
// import type { TableOfContents } from "@/types";
// import { GettingStarted } from "@/doc/getting-started.meta";
// register all site pages here for routing
import { GettingStarted } from "@/doc/getting-started.meta";
import { InteractFirstForm } from "@/doc/interact-first-form.meta";
import { SchemaBasics } from "@/doc/schema.basics.meta";
import { SchemaProperties } from "@/doc/schema.properties.meta";
import { SchemaSelectors } from "@/doc/schema.selectors.meta";
import { ValidatorList } from "@/doc/validator.list.meta";
import { Introduction } from "@/pages/introduction.meta";
import { Playground } from "@/pages/playground/playground.meta";
import { Theme } from "@/pages/theme.meta";
import type { DocNode, TableOfContentsItem } from "@/types";

export const docPages: DocComponentPageMeta[] = [
    Introduction,
    GettingStarted,
    FirstSchema,
    FirstForm,
    InteractFirstForm,
    Playground,
    SchemaBasics,
    SchemaProperties,
    SchemaSelectors,
    Theme,
    ValidatorList,
];

// register the actual table of contents (sidebar) structure
export const tableOfContents: TableOfContentsItem[] = [
    {
        title: "Guides",
        children: [Introduction, GettingStarted, FirstSchema, FirstForm, InteractFirstForm, Playground],
    },
    // {
    //     title: "Schema",
    //     children: [
    //         {
    //             title: "Basics",
    //             children: [SchemaBasics, SchemaProperties, SchemaSelectors],
    //         },
    //         {
    //             title: "Validation",
    //             children: [ValidatorList],
    //         },
    //     ],
    // },
];

// compute it at build time
calculateNextPrevChildren((tableOfContents[0] as DocNode).children);

export function calculateNextPrevChildren(children: TableOfContentsItem[]) {
    for (let i = 0; i < children.length; i++) {
        if (i === 0 && isDocComponent(children[i])) {
            if (children[i + 1] !== undefined) {
                if (!isDocComponent(children[i + 1])) {
                    (children[i] as DocComponentPageMeta).next = (children[i + 1] as DocNode)
                        .children[0] as DocComponentPageMeta;
                } else {
                    (children[i] as DocComponentPageMeta).next = children[i + 1] as DocComponentPageMeta;
                }
            }
        }

        if (children[i + 1] !== undefined) {
            if (!isDocComponent(children[i + 1])) {
                (children[i] as DocComponentPageMeta).next = (children[i + 1] as DocNode)
                    .children[0] as DocComponentPageMeta;
            } else {
                (children[i] as DocComponentPageMeta).next = children[i + 1] as DocComponentPageMeta;
            }
        }

        if (children[i - 1] !== undefined && isDocComponent(children[i - 1])) {
            (children[i] as DocComponentPageMeta).previous = children[i - 1] as DocComponentPageMeta;
        }
    }
}

export function isDocComponent(item: TableOfContentsItem): item is DocComponentPageMeta {
    return (item as DocComponentPageMeta).loader !== undefined;
}
