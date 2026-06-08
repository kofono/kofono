import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { render } from "solid-js/web";
import "../../packages/kofono-solid-form/dist/style.css";
import "./styles.css";

import { MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { For, lazy, type ParentProps } from "solid-js";
import { RootLayout } from "@/layouts/root-layout";
import { docPages } from "@/table-of-contents";

const queryClient = new QueryClient();

function App(props: ParentProps) {
    return (
        <MetaProvider>
            <QueryClientProvider client={queryClient}>
                <RootLayout>{props.children}</RootLayout>
            </QueryClientProvider>
        </MetaProvider>
    );
}

const rootElement = document.getElementById("doc");
if (rootElement) {
    render(
        () => (
            <Router root={App} base={import.meta.env.BASE_URL}>
                <For each={docPages}>{d => <Route path={d.path} component={lazy(d.loader as any)} />}</For>
            </Router>
        ),
        rootElement,
    );
}
