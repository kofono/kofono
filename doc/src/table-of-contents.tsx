import { GettingStarted } from "@/doc/getting-started";
import { SchemaBasics } from "@/doc/schema.basics";
import { SchemaProperties } from "@/doc/schema.properties";
import { SchemaSelectors } from "@/doc/schema.selectors";
import { ValidatorList } from "@/doc/validator.list";
import { Introduction } from "@/pages/introduction";
import { Playground } from "@/pages/playground";
import { Theme } from "@/pages/theme";
import type { TableOfContents } from "@/types";

// register all site pages here for routing
export const docPages: DocComponentPage[] = [
    Introduction,
    GettingStarted,
    Playground,
    SchemaBasics,
    SchemaProperties,
    SchemaSelectors,
    Theme,
    ValidatorList,
];

// register the actual table of contents (sidebar) structure
export const tableOfContents: TableOfContents = [
    {
        title: "Guides",
        children: [Introduction, GettingStarted, Playground],
    },
    {
        title: "Schema",
        children: [
            {
                title: "Basics",
                children: [SchemaProperties, SchemaSelectors],
            },
            {
                title: "Validation",
                children: [ValidatorList],
            },
        ],
    },
];
