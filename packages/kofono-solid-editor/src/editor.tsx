// src/components/AceEditor.tsx

import * as ace from "ace-builds";
import * as Completer from "ace-builds/src-noconflict/ext-language_tools";
import { onCleanup, onMount } from "solid-js";
import { defaultOptions } from "./default";
import type { AceOptions } from "./types";

// IMPORTANT: you’ll also import the mode/theme you want:
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-github_dark";
import "ace-builds/src-noconflict/theme-merbivore";

interface AceEditorProps {
    class?: string; //todo: deprecated
    value?: string;
    onChange?: (value: string) => void;
    mode?: string;
    theme?: string;
    style?: any;
    options?: Partial<AceOptions>;
}

export function Editor(props: AceEditorProps) {
    let editorRef: HTMLDivElement | undefined;

    onMount(() => {
        const opts = { ...defaultOptions, ...props.options };
        opts;

        if (!editorRef) {
            return;
        }

        const editor = ace.edit(editorRef, {
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            mode: `ace/mode/${props.mode ?? "javascript"}`,
            theme: `ace/theme/${props.theme ?? "merbivore"}`,
            value: props.value ?? "",
            fontSize: props.options?.fontSize ?? 15,
            fontFamily: "Roboto Mono, monospace",
            highlightActiveLine: props.options?.highlightActiveLine ?? true,
            highlightSelectedWord: props.options?.highlightSelectedWord ?? true,
            readOnly: props.options?.readOnly ?? false,
            showFoldWidgets: props.options?.showFoldWidgets ?? true,
            showGutter: props.options?.showGutter ?? true,
            showLineNumbers: props.options?.showLineNumbers ?? true,
            showPrintMargin: props.options?.showPrintMargin ?? true,
            tabSize: props.options?.tabSize ?? 4,
            useSoftTabs: props.options?.useSoftTabs ?? true,
            wrap: props.options?.wrap ?? true,
            useWorker: false,
        });

        // when content changes, call onChange
        editor.session.on("change", () => {
            const val = editor.getValue();
            props.onChange?.(val);
        });

        // Enable language tools
        Completer.setCompleters([
            // Basic word completions (built-in)
            // Language completions (for supported languages)
            // Custom completers here
        ]);
        // Add custom completions
        Completer.addCompleter({
            getCompletions: (_editor, _session, _pos, _prefix, callback) => {
                const completions = [
                    {
                        name: "min",
                        value: "min(0)",
                        type: "function",
                        meta: "Validator",
                    },
                ];
                callback(null, completions);
            },
        });

        Completer.addCompleter({
            identifierRegexps: [/[a-zA-Z_0-9$\u00A1-\uFFFF]/],
            getCompletions: (_editor, _session, _pos, _prefix, callback) => {
                const completions = [
                    {
                        caption: "form",
                        meta: "method",
                        value: "form({})",
                        type: "function",
                    },
                    {
                        caption: "string",
                        meta: "function",
                        value: "string()",
                        type: "function",
                    },
                    {
                        caption: "number",
                        meta: "function",
                        value: "number()",
                        type: "function",
                    },
                    {
                        caption: "boolean",
                        meta: "function",
                        value: "boolean()",
                        type: "function",
                    },
                    // Add other K methods here
                ];
                callback(null, completions);
            },
        });

        onCleanup(() => {
            editor.destroy();
            // remove element if needed
            editorRef!.innerHTML = "";
        });

        // Optionally set size or autosize
        editor.resize();
    });

    const style = (name: string, defaultValue: string) => ({
        [name]: props.style?.[name] ?? defaultValue,
    });
    style("width", "100%");

    return (
        <div
            class={props.class ?? ""}
            ref={editorRef!}
            style={{
                ...style("width", "100%"),
                ...style("height", "auto"),
                ...style("background", "rgba(0, 0, 0, 0.1)"),
                ...style("border-radius", "6px"),
                ...style("padding", "0"),
                ...style("box-sizing", "border-box"),
                ...style("overflow", "auto"),
                ...style("font-family", "Roboto Mono, monospace"),
                ...style("font-size", "1rem"),
                ...style("line-height", "1.1rem"),
                ...style("tab-size", "4"),
                ...style("border", "transparent"),
            }}
        />
    );
}
