import { Editor } from "@kofono/solid-editor";
import { cn } from "@/utils";

type CodeBlockProps = {
    class?: string;
    value: string;
    language?: "json" | "javascript";
    readonly?: boolean;
    height?: string;
};

export function CodeBlock(props: CodeBlockProps) {
    const isReadonly = props.readonly ?? true;

    return (
        <div class={cn("pt-1 rounded-md squircle bg-base-200", props.class, isReadonly && "readonly")}>
            <Editor
                value={props.value}
                mode={props.language ?? "javascript"}
                theme="github_dark"
                style={{
                    height: props.height ?? estimateHeight(props.value),
                    background: "transparent",
                    padding: "0",
                }}
                options={{
                    readOnly: isReadonly,
                    showPrintMargin: false,
                    showLineNumbers: false,
                    showFoldWidgets: false,
                    showGutter: false,
                    highlightActiveLine: false,
                }}
            />
        </div>
    );
}

export function CodeBlockLarge(props: CodeBlockProps) {
    return (
        <div class="p-2 bg-base-200 rounded-box-border">
            <CodeBlock value={props.value} language={props.language} readonly={props.readonly} height={props.height} />
        </div>
    );
}

function estimateHeight(value: string) {
    const lines = value.split("\n");
    const lineHeight = 18.5; //px
    const height = lines.length * lineHeight;
    return `${height}px`;
}
