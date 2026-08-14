import type { JSX } from "solid-js";

// We need to import table of contents, otherwise we getUncaught ReferenceError: can't access lexical declaration '...' before initialization
// import { tableOfContents } from "@/table-of-contents";

export function RootLayout(props: { children: JSX.Element }) {
    // tableOfContents;
    return <>{props.children}</>;
}
