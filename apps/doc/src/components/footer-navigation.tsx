import { A } from "@solidjs/router";
import {
    MdOutlineNavigate_before,
    MdOutlineNavigate_next
} from "solid-icons/md";
import { Show } from "solid-js";

interface FooterNavigationProps {
    next?: string;
    nextUrl?: string;
    previous?: string;
    previousUrl?: string;
}
export function FooterNavigation(props: FooterNavigationProps) {
    return (
        <>
            <Show when={props.previous && props.previousUrl !== undefined} fallback={<div></div>}>
                <A
                    class="relative p-4 bg-base-300 rounded-lg hover:bg-primary/5 transition-all transition-discrete duration-300 ease-in-out cubic-bezier(0.4, 0, 0.2, 1)"
                    href={props.previousUrl as string}>
                    <span class="block text-base-content/40 text-sm leading-5">
                        <MdOutlineNavigate_before class="inline-block w-6 h-6 -mt-0.5" /> PREVIOUS
                    </span>
                    <span class="block text-base-content font-bold pl-2">{props.previous}</span>
                </A>
            </Show>
            <Show when={props.next && props.nextUrl !== undefined}>
                <A
                    class="relative p-4 border border-primary/80 hover:border-primary bg-base-300 hover:bg-primary/10 rounded-lg transition-all transition-discrete duration-300 ease-in-out"
                    href={props.nextUrl as string}>
                    <span class="block text-base-content/40 text-sm text-right leading-5">
                        NEXT <MdOutlineNavigate_next class="inline-block w-6 h-6 -mt-0.5" />
                    </span>
                    <span class="block text-base-content font-bold text-right text-base-contentpr-2">{props.next}</span>
                </A>
            </Show>
        </>
    );
}
