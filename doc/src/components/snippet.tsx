interface SnippetProps {
    value: string;
    language?: string;
    readonly?: boolean;
    height?: string;
}
export function Snippet(props: SnippetProps) {
    return (
        <div class="mockup-codef p-4 rounded-md w-full bg-base-300">
            <pre data-prefix="$" class="text-sm rounded-lg">
                <code innerHTML={replacePlaceholders(props.value)}></code>
            </pre>
        </div>
    );
}

const placeholders = [
    "primary",
    "secondary",
    "accent",
    "neutral",
    "info",
    "danger",
    "warning",
    "success",
];

// pattern =    {placeholder_toextract:value_toextract}
const placeholderRegex = new RegExp(
    `\\{(${placeholders.join("|")}):([^}]+)\\}`,
    "gm",
);
function replacePlaceholders(value: string) {
    return value.replace(
        placeholderRegex,
        (_match, color, content) =>
            `<span class="text-${color}">${content}</span>`,
    );
}
