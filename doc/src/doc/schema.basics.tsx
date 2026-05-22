import { CodeBlock } from "@/components/code-block";
import { CodeTabs } from "@/components/code-tabs";
import { Code, H1, Spacer } from "@/components/html";
import { DocLayout } from "@/layouts/doc-layout";

export const SchemaBasics: DocComponentPage = {
    path: "/schema/basics",
    title: "Schema Basics",
    menuTitle: "Basics",
    description: "",
    keywords: [],
    component: RouteComponent,
};

function RouteComponent() {
    return (
        <DocLayout>
            <H1>Schema Basics</H1>
            <p>
                At is root, Kofono is a schema based validation library. You
                define your form schema with a JSON schema like syntax or use
                Typescript fluent syntax. One difference from JSON schema is
                that <Code>properties</Code> are named<Code>__</Code> for
                brevity and readability.
            </p>
            <p>
                A schema is composed of a set of properties, each of which has a
                type and optional metadata.
            </p>
            <Spacer />
            Example:
            <CodeTabs
                tabs={[
                    {
                        label: "JSON Schema",
                        active: true,
                        content: (
                            <CodeBlock
                                value={`import { Schema } from "kofono";

const schema: Schema = {
    $id: "my-form",
    __: {
        propA: { 
            type: "string" 
        },
    }
}`}
                            />
                        ),
                    },
                    {
                        label: "Typescript Builder",
                        content: (
                            <CodeBlock
                                value={`import { S } from "kofono";

const schema = K.schema({
    $id: "my-form",
    propA: K.string(),
}`}
                            />
                        ),
                    },
                ]}
            />
            <Spacer />
        </DocLayout>
    );
}
