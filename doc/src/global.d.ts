import type { Component } from "solid-js";

declare global {
    interface DocComponentPageMeta {
        path: string;
        title: string;
        menuTitle?: string;
        description: string;
        keywords?: string[];
        next?: DocComponentPageMeta | undefined;
        previous?: DocComponentPageMeta | undefined;
        loader: () => Promise<{ default: Component }>;
    }
}

export {};
