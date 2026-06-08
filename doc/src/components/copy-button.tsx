import { createSignal } from "solid-js";
import { cn } from "@/utils";

interface CopyButtonProps {
    class?: string;
    content: string;
}

export function CopyButton(props: CopyButtonProps) {
    const [copied, setCopied] = createSignal(false);
    const [animating, setAnimating] = createSignal(false);

    const copy = async () => {
        await navigator.clipboard.writeText(props.content);
        setCopied(true);
        setAnimating(true);
        setTimeout(() => setAnimating(false), 300);
        setTimeout(() => setCopied(false), 1100);
    };

    return (
        <button
            title="Copy to clipboard"
            type="button"
            class={cn(
                "btn btn-xs text-primary-content/10 hover:btn-primary hover:text-primary-content animate-in fade-in",
                animating() && "scale-90",
                // copied() && "btn-success text-success-content",
                props.class,
            )}
            onClick={copy}>
            {copied() ? <>copied!</> : <>copy</>}
        </button>
    );
}
//
// export function CopyButtonIcon() {
//     return (
//         <svg aria-hidden="true" viewBox="0 0 24 24" class=" p-2 animate-in fade-in zoom-in duration-200">
//             <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
//             <path d="M0 0h24v24H0z" fill="none" />
//         </svg>
//     );
// }
//
// export function CheckIcon() {
//     return (
//         <svg aria-hidden="true" viewBox="0 0 24 24" class="p-2 animate-in fade-in zoom-in duration-200">
//             <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//         </svg>
//     );
// }
