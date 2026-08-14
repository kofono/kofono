import { JSX } from "solid-js";
import { Header } from "@/components/header";

export function FullScreenLayout(props: { children: JSX.Element }) {
    return (
        <div class="m-auto max-w-screen-2xl">
            <Header />
            <main class="p-6">{props.children}</main>
        </div>
    );
}
