import { type JSXElement, Show } from "solid-js";
import { cn } from "@/utils";

type ElementWithClass = {
    class?: string;
};

type ElementWithProps = ElementWithClass & {
    children?: JSXElement;
};

export function H1(props: ElementWithProps) {
    return <h1 class={cn("text-2xl mb-2", props.class)}>{props.children}</h1>;
}

export function H2(props: ElementWithProps) {
    return <h2 class={cn("text-xl mb-1", props.class)}>{props.children}</h2>;
}

export function H3(props: ElementWithProps) {
    return <h3 class={cn("text-lg mb-1", props.class)}>{props.children}</h3>;
}

export function H4(props: ElementWithProps) {
    return <h4 class={cn("text-md mb-1", props.class)}>{props.children}</h4>;
}

export function StrongSecondary(props: ElementWithProps) {
    return (
        <strong class={cn("text-secondary", props.class)}>
            {props.children}
        </strong>
    );
}

export function StrongAccent(props: ElementWithProps) {
    return (
        <strong class={cn("text-primary", props.class)}>
            {props.children}
        </strong>
    );
}

export function Spacer() {
    return <div class="h-2 border-b border-base-300 border-opacity-20" />;
}

export function Code(props: ElementWithProps) {
    return (
        <code
            class={cn(
                "code px-1 mx-1 text-[0.95rem] text-bold tracking-tight rounded-sm",
                props.class,
            )}>
            {props.children}
        </code>
    );
}

export function Hr(props: ElementWithClass) {
    return <hr class={cn("text-base-100", props.class)} />;
}

export interface TableProps {
    head?: JSXElement;
    body: JSXElement;
    foot?: JSXElement;
}

export function Table(props: TableProps) {
    return (
        <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-200">
            <table class="table">
                <Show when={props.head}>
                    <thead class="bg-primary text-primary-content">
                        {props.head}
                    </thead>
                </Show>
                <tbody>{props.body}</tbody>
                <Show when={props.foot}>
                    <tfoot>{props.foot}</tfoot>
                </Show>
            </table>
        </div>
    );
}
