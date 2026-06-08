import { type JSXElement, Show } from "solid-js";
import { cn } from "@/utils";

type ElementWithClass = {
    class?: string;
};

type ElementWithProps = ElementWithClass & {
    children?: JSXElement;
};

type HeadingElementWithProps = ElementWithProps & {
    id?: string;
};

export function H1(props: HeadingElementWithProps) {
    return (
        <h1 id={props.id} class={cn("text-4xl mb-2", props.class)}>
            {props.children}
        </h1>
    );
}

export function H2(props: HeadingElementWithProps) {
    return (
        <h2 id={props.id} class={cn("text-xl mb-1", props.class)}>
            {props.children}
        </h2>
    );
}

export function H3(props: HeadingElementWithProps) {
    return (
        <h3 id={props.id} class={cn("text-lg mb-1", props.class)}>
            {props.children}
        </h3>
    );
}

export function H4(props: HeadingElementWithProps) {
    return (
        <h4 id={props.id} class={cn("text-md mb-1", props.class)}>
            {props.children}
        </h4>
    );
}

export function StrongSecondary(props: ElementWithProps) {
    return <strong class={cn("text-secondary", props.class)}>{props.children}</strong>;
}

export function StrongAccent(props: ElementWithProps) {
    return <strong class={cn("text-primary", props.class)}>{props.children}</strong>;
}

export function Spacer() {
    return <div class="h-2 border-b border-base-300 border-opacity-20" />;
}

export function Code(props: ElementWithProps) {
    return (
        <code
            class={cn(
                "px-1 mx-1 text-[0.95rem] text-bold tracking-tight",
                "rounded-sm bg-base-content/20 text-base text-shadow-accent text-shadow-2xs",
                props.class,
            )}>
            {props.children}
        </code>
    );
}

export function CodeAccent(props: ElementWithProps) {
    return <code class={cn("text-shadow-accent text-shadow-2xs", props.class)}>{props.children}</code>;
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
                    <thead class="bg-primary text-primary-content">{props.head}</thead>
                </Show>
                <tbody>{props.body}</tbody>
                <Show when={props.foot}>
                    <tfoot>{props.foot}</tfoot>
                </Show>
            </table>
        </div>
    );
}

export function Blockquote(props: ElementWithProps) {
    return <blockquote class={cn("blockquote", props.class)}>{props.children}</blockquote>;
}

export function List(props: ElementWithProps) {
    return <ul class={cn("list-disc list-inside", props.class)}>{props.children}</ul>;
}
