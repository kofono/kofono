import { builtinValidators } from "kofono";
import { For } from "solid-js";
import { H1, Spacer } from "@/components/html";
import { DocLayout } from "@/layouts/doc-layout";

export default function () {
    return (
        <DocLayout>
            <H1>Built-in Validators</H1>
            <p>Here the list of Kofono build-in validators</p>
            <Spacer />
            <ul>
                <For each={builtinValidators}>
                    {(validator, _) => <li>{validator.name}</li>}
                </For>
            </ul>
        </DocLayout>
    );
}
