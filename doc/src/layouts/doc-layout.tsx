import { createSignal, For, JSX, onCleanup, onMount, Show } from "solid-js";
import { BuildInfo } from "@/components/build-info";
import { FooterNavigation } from "@/components/footer-navigation";
import { Header } from "@/components/header";
import { Spacer } from "@/components/html";
import { TableOfContents } from "@/components/table-of-contents";
import { tableOfContents } from "@/table-of-contents";

type AnchorString = string;

interface DocLayoutProps {
    children: JSX.Element;
    meta?: DocComponentPageMeta;
    sideContent?: JSX.Element;
    onThisPage?: Record<AnchorString, string>;
}

export function DocLayout(props: DocLayoutProps) {
    const [activeId, setActiveId] = createSignal<string | null>(null);

    onMount(() => {
        if (!props.onThisPage) {
            return;
        }

        const ids: AnchorString[] = Object.keys(props.onThisPage);
        const elements = ids.map(id => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) {
            return;
        }

        // Track visibility ratios so we can pick the best candidate
        const visible = new Map<string, number>();

        const observer = new IntersectionObserver(
            entries => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        visible.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visible.delete(entry.target.id);
                    }
                }

                if (visible.size > 0) {
                    // Pick the first visible heading in document order
                    const firstVisible = elements.find(el => visible.has(el.id));
                    if (firstVisible) {
                        setActiveId(firstVisible.id);
                    }
                } else {
                    // Fallback: pick the last heading above the viewport
                    const scrollY = window.scrollY;
                    let current: string | null = null;
                    for (const el of elements) {
                        if (el.getBoundingClientRect().top + scrollY <= scrollY + 100) {
                            current = el.id;
                        }
                    }
                    if (current) {
                        setActiveId(current);
                    }
                }
            },
            {
                // Trigger when heading is in the top portion of the viewport
                rootMargin: "0px 0px -70% 0px",
                threshold: [0, 1],
            },
        );

        for (const el of elements) {
            observer.observe(el);
        }

        onCleanup(() => observer.disconnect());
    });

    return (
        <div class="m-auto max-w-screen-2xl">
            <Header />
            <div class="drawer drawer-open">
                <input id="my-drawer-4" type="checkbox" class="drawer-toggle" checked={true} />
                <div class="drawer-content">
                    <div class="flex">
                        {/* Main content area */}
                        <div class="flex-1 p-8 mb-40 min-w-0">
                            <div class="flex flex-col gap-5">
                                {props.children}
                                <Spacer />
                                <div class="flex justify-between">
                                    <FooterNavigation
                                        next={props.meta?.next?.title}
                                        nextUrl={props.meta?.next?.path}
                                        previous={props.meta?.previous?.title}
                                        previousUrl={props.meta?.previous?.path}
                                    />
                                </div>
                            </div>
                            <div class="text-center mt-20">
                                <BuildInfo />
                            </div>
                        </div>

                        {/* Right fixed-width sidebar */}
                        <aside class="w-64 shrink-0 sticky top-0 self-start h-screen overflow-y-auto p-6 border-l border-base-300 hidden lg:block">
                            <div class="flex flex-col gap-3">
                                <Show when={props.onThisPage}>
                                    <div>
                                        <div class="text-sm font-semibold uppercase opacity-70 mb-2">On this page</div>
                                        <Spacer />
                                        <ul class="ml-2 mt-4 flex flex-col gap-1">
                                            <For each={Object.entries(props.onThisPage!)}>
                                                {([key, value]) => {
                                                    const id = key.toLowerCase().replaceAll(" ", "-");
                                                    const isActive = () => activeId() === id;
                                                    return (
                                                        <li>
                                                            <a
                                                                href={`#${id}`}
                                                                classList={{
                                                                    "text-xs hover:underline block transition-colors": true,
                                                                    "text-primary font-semibold": isActive(),
                                                                    "opacity-70": !isActive(),
                                                                }}>
                                                                {value}
                                                            </a>
                                                        </li>
                                                    );
                                                }}
                                            </For>
                                        </ul>
                                    </div>
                                </Show>
                                <Show when={props.sideContent}>{props.sideContent}</Show>
                            </div>
                        </aside>
                    </div>
                </div>

                <div class="drawer-side is-drawer-close:overflow-visible p-0">
                    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
                    <div class="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-200 flex flex-col items-start min-h-full pt-8">
                        {/* Sidebar content here */}
                        <TableOfContents table={tableOfContents} />

                        {/* button to open/close drawer */}
                        <div class="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Open">
                            <label
                                for="my-drawer-4"
                                class="btn btn-ghost btn-circle drawer-button is-drawer-open:rotate-y-180">
                                <svg
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    stroke-linejoin="round"
                                    stroke-linecap="round"
                                    stroke-width="2"
                                    fill="none"
                                    stroke="currentColor"
                                    class="inline-block size-4 my-1.5">
                                    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                    <path d="M9 4v16"></path>
                                    <path d="M14 10l2 2l-2 2"></path>
                                </svg>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
