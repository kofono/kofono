import { For, type JSX } from "solid-js";
import { cn } from "@/utils";

export type Tab = {
    content: JSX.Element;
    label: string;
    active?: boolean;
};

export type CodeTabsProps = {
    tabs: Tab[];
};

export function CodeTabs(props: CodeTabsProps) {
    const uniqueId = Math.random().toString(36).substring(7);

    return (
        <div class="rounded-box-border">
            <div class="tabs tabs-box">
                <For each={props.tabs}>
                    {tab => (
                        <>
                            <input
                                type="radio"
                                name={uniqueId}
                                aria-label={tab.label}
                                checked={tab.active}
                                class={cn(
                                    "tab",
                                    "shadow-none",
                                    // tab.active
                                    //     ? "bg-primary/50 text-primary-content"
                                    //     : "",
                                )}
                            />
                            <div class="tab-content">{tab.content}</div>
                        </>
                    )}
                </For>
            </div>
        </div>
    );
}
