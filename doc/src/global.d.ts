import type { Component } from "solid-js";

declare global {
    const __BUILD_DATE__: string;

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
