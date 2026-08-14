export interface JsonCodeBlockProps {
    json: Record<string, any>;
}

export function JsonCodeBlock(props: JsonCodeBlockProps) {
    return (
        <pre>
            <code>{JSON.stringify(props.json, null, 2)}</code>
        </pre>
    );
}
