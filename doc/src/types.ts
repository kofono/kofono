import type { JSX } from "solid-js";

export type DocNode = {
    title: string;
    children: TableOfContentsItem[];
    meta?: Meta;
    icon?: JSX.Element;
};

export type Meta = {
    keywords?: string[];
    pageTitle?: string;
};

export type TableOfContentsItem = DocNode | DocComponentPageMeta;
