import { A, useLocation } from "@solidjs/router";
import { createMemo, For } from "solid-js";
import { H2, H4 } from "@/components/html";
import type {
    TableOfContents as TableOfContentsType,
    TableOfContentsItem,
} from "@/types";
import { cn } from "@/utils";

export type TableOfContentsProps = {
    table: TableOfContentsType;
};

export function TableOfContents(props: TableOfContentsProps) {
    return (
        <ul class="menu w-full grow pt-0 mt-0 px-4">
            <For each={props.table} fallback={<li>Loading...</li>}>
                {(item: TableOfContentsItem) => {
                    if (isDocComponent(item)) {
                        return <LeafContent item={item} />;
                    }
                    return (
                        <>
                            <H2>{item.title}</H2>
                            <NodeContent children={item.children} root={true} />
                        </>
                    );
                }}
            </For>
        </ul>
    );
}

function isDocComponent(item: TableOfContentsItem): item is DocComponentPage {
    return (item as DocComponentPage).component !== undefined;
}

type NodeContentProps = {
    children: TableOfContentsType;
    root?: boolean;
};
function NodeContent(props: NodeContentProps) {
    return (
        <div
            class={cn(
                "pb-2 mb-2",
                props.root === true && "border-b border-base-100",
            )}>
            <For each={props.children} fallback={<li>Loading2...</li>}>
                {(item: TableOfContentsItem) => {
                    if (isDocComponent(item)) {
                        return <LeafContent item={item} />;
                    }
                    return (
                        <>
                            <H4 class="pl-0 mt-2">{item.title}</H4>
                            <div class="pl-0">
                                <NodeContent
                                    children={item.children}
                                    root={false}
                                />
                            </div>
                        </>
                    );
                }}
            </For>
        </div>
    );
}

function LeafContent(props: { item: DocComponentPage }) {
    const location = useLocation();
    const isActive = createMemo(() => location.pathname === props.item.path);
    return (
        <li class="h-7">
            <A
                href={props.item.path}
                class={cn(
                    "text-accent-content",
                    "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                    "hover:bg-transparent hover:text-primary",
                    isActive() && "text-primary",
                )}
                data-tip={props.item.title}>
                <span class="is-drawer-close:hidden">
                    {props.item.menuTitle ?? props.item.title}
                </span>
            </A>
        </li>
    );
}
