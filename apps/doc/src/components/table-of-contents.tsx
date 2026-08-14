import { A, useLocation } from "@solidjs/router";
import { createMemo, For } from "solid-js";
import { H2, H4 } from "@/components/html";
import { isDocComponent } from "@/table-of-contents";
import type { TableOfContentsItem } from "@/types";
import { cn } from "@/utils";

export type TableOfContentsProps = {
    table: TableOfContentsItem[];
};

export function TableOfContents(props: TableOfContentsProps) {
    return (
        <ul class="menu w-full grow pt-0 mt-0 px-4 ">
            <For each={props.table} fallback={<li>Loading...</li>}>
                {(item: TableOfContentsItem) => {
                    if (isDocComponent(item)) {
                        return <LeafContent item={item} />;
                    }
                    return (
                        <>
                            <H2 class="is-drawer-close:hidden">{item.title}</H2>
                            <NodeContent children={item.children} root={true} />
                        </>
                    );
                }}
            </For>
        </ul>
    );
}

type NodeContentProps = {
    children: TableOfContentsItem[];
    root?: boolean;
};

function NodeContent(props: NodeContentProps) {
    return (
        <div class={cn("pb-2 mb-2 is-drawer-close:hidden", props.root === true && "border-b border-base-100")}>
            <For each={props.children} fallback={<li>Loading2...</li>}>
                {(item: TableOfContentsItem) => {
                    if (isDocComponent(item)) {
                        return <LeafContent item={item} />;
                    }
                    return (
                        <>
                            <H4 class="mt-2">{item.title}</H4>
                            <div class="">
                                <NodeContent children={item.children} root={false} />
                            </div>
                        </>
                    );
                }}
            </For>
        </div>
    );
}

function LeafContent(props: { item: DocComponentPageMeta }) {
    const location = useLocation();
    const isActive = createMemo(() => location.pathname === props.item.path);
    return (
        <li class="h-7">
            <A
                href={props.item.path}
                class={cn(
                    "text-base-content",
                    "is-drawer-close:tooltip is-drawer-close:tooltip-right",
                    "hover:bg-transparent hover:text-primary",
                    isActive() && "text-primary text-shadow-black text-shadow-lg",
                )}
                data-tip={props.item.title}>
                <span class="is-drawer-close:hidden">{props.item.menuTitle ?? props.item.title}</span>
            </A>
        </li>
    );
}
