import type { JSX } from "solid-js";
import { Header } from "@/components/header";
import { TableOfContents } from "@/components/table-of-contents";
import { tableOfContents } from "@/table-of-contents";

export function DocLayout(props: { children: JSX.Element }) {
    // const navigate = useNavigate();

    return (
        <div class="m-auto max-w-screen-2xl">
            <Header />
            <div class="drawer drawer-open">
                <input
                    id="my-drawer-4"
                    type="checkbox"
                    class="drawer-toggle"
                    checked={true}
                />
                <div class="drawer-content">
                    <div class="p-8 mb-40">
                        <div class="flex flex-col gap-5">{props.children}</div>
                    </div>
                </div>

                <div class="drawer-side is-drawer-close:overflow-visible p-0">
                    <label
                        for="my-drawer-4"
                        aria-label="close sidebar"
                        class="drawer-overlay"></label>
                    <div class="is-drawer-close:w-14 is-drawer-open:w-64 bg-base-200 flex flex-col items-start min-h-full pt-8">
                        {/* Sidebar content here */}
                        <TableOfContents table={tableOfContents} />
                        {/*<ul class="menu w-full grow mt-0 pt-0"></ul>*/}

                        {/* button to open/close drawer */}
                        <div
                            class="m-2 is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Open">
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
