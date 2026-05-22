import { CodeBlock } from "@/components/code-block";
import { CodeTabs } from "@/components/code-tabs";
import { Code, H1, H2, Spacer, Table } from "@/components/html";
import { DocLayout } from "@/layouts/doc-layout";

export const SchemaProperties: DocComponentPage = {
    path: "/schema/properties",
    title: "Schema Properties",
    menuTitle: "Properties",
    description: "",
    keywords: [],
    component: RouteComponent,
};

const exampleObjectJson: string = `const schema = {
    __: {
        propA: { 
            type: "object",
            __: {
                subProp: {
                    type: "string",
                }
            } 
        }
    }
}`;

const exampleObjectBuilder: string = `const schema = K.schema({
    propA: K.object({
        subProp: K.string()
    })
}`;

const exampleStringNumberBoolJson: string = `const schema = {
    __: {
        propA: { 
            type: "string" 
        },
        propB: { 
            type: "number"
        },
        propC: { 
            type: "boolean"
        }
    }
}`;

function RouteComponent() {
    return (
        <DocLayout>
            <H1>Properties</H1>
            <p>
                Properties are the bread and butter of your schema. They define
                the structure of your form data. Each property has a type and
                optional metadata. Some types are answerable, meaning they can
                be answered by the user, while others act as container for
                nested properties.
            </p>
            <p>Kofono supports the following property types:</p>

            <Table
                head={
                    <tr>
                        <th>type</th>
                        <th>answerable</th>
                        <th>tree type</th>
                    </tr>
                }
                body={
                    <>
                        <tr>
                            <td>
                                <code>string</code>
                            </td>
                            <td>Yes</td>
                            <td>Leaf</td>
                        </tr>
                        <tr>
                            <td>
                                <code>number</code>
                            </td>
                            <td>Yes</td>
                            <td>Leaf</td>
                        </tr>
                        <tr>
                            <td>
                                <code>boolean</code>
                            </td>
                            <td>Yes</td>
                            <td>Leaf</td>
                        </tr>
                        <tr>
                            <td>
                                <code>list&lt;string&gt;</code>
                            </td>
                            <td>Yes</td>
                            <td>Leaf</td>
                        </tr>
                        <tr>
                            <td>
                                <code>list&lt;number&gt;</code>
                            </td>
                            <td>Yes</td>
                            <td>Leaf</td>
                        </tr>
                        <tr>
                            <td>
                                <code>list&lt;boolean&gt;</code>
                            </td>
                            <td>Yes</td>
                            <td>Leaf</td>
                        </tr>
                        <tr>
                            <td>
                                <code>list&lt;mixed&gt;</code>
                            </td>
                            <td>Yes</td>
                            <td>Leaf</td>
                        </tr>
                        <tr>
                            <td>
                                <code>array</code>
                            </td>
                            <td>No</td>
                            <td>Node</td>
                        </tr>
                        <tr>
                            <td>
                                <code>object</code>
                            </td>
                            <td>No</td>
                            <td>Node</td>
                        </tr>
                        <tr>
                            <td>
                                <code>null</code>
                            </td>
                            <td>No</td>
                            <td>Leaf</td>
                        </tr>
                    </>
                }></Table>

            <p class="pl-4">
                <i>Leaf</i>: A property that cannot contain other properties.
                <br />
                <i>Node</i>: A property that can contain other properties.
                <br />
                <i>Answerable</i>: A property that can be answered by the user.
            </p>

            <Spacer />

            <H1>String, Boolean, Number types</H1>
            <p>
                Category: <Code>Leaf</Code> <Code>Answerable</Code>
            </p>
            <p>
                These types are pretty straightforward. Ideal for input,
                textarea, single checkbox, radio group, select, etc.
            </p>

            <CodeTabs
                tabs={[
                    {
                        label: "JSON Schema",
                        content: (
                            <CodeBlock
                                value={exampleStringNumberBoolJson}
                                height={"280px"}
                            />
                        ),
                        active: true,
                    },
                    {
                        label: "Typescript Builder",
                        content: (
                            <CodeBlock
                                value={exampleObjectBuilder}
                                height={"100px"}
                            />
                        ),
                    },
                ]}
            />

            <Spacer />

            <H1>Object type</H1>
            <p>
                Category: <Code>Node</Code> <Code>Non-Answerable</Code>
            </p>
            <p>
                An object type is a collection of properties. It can be nested
                inside other object types. Objects act as containers for other
                properties and cannot be answered directly.
            </p>

            <CodeTabs
                tabs={[
                    {
                        label: "JSON Schema",
                        content: (
                            <CodeBlock
                                value={exampleObjectJson}
                                height={"260px"}
                            />
                        ),
                        active: true,
                    },
                    {
                        label: "Typescript Builder",
                        content: (
                            <CodeBlock
                                height={"220px"}
                                value={`const schema = K.schema({
    address: K.object({
        street: K.string(),
        city: K.string(),
        location: K.object({ 
            lat: K.number(), 
            lng: K.number() 
        }),
    }),
});`}
                            />
                        ),
                    },
                ]}
            />

            <Spacer />

            <H1>List types</H1>
            <H2>
                list&lt;string&gt, list&lt;number&gt;, list&lt;boolean&gt;,
                list&lt;mixed&gt;
            </H2>
            <p>
                Category: <Code>Leaf</Code> <Code>Answerable</Code>
            </p>
            <p>
                Lists represent a collection of values of a specific type. They
                can be used to store multiple values of the same type. They are
                ideal for checkboxes, radio buttons, select or other fields that
                allow multiple selections. If the type is dynamic, you can use
                the mixed type to store any value.
            </p>

            <CodeTabs
                tabs={[
                    {
                        label: "JSON Schema",
                        content: (
                            <CodeBlock
                                height={"180px"}
                                value={`const schema = {
    __: {
        s: { type: "list<string>" },
        n: { type: "list<number>" },
        b: { type: "list<boolean>" },
        m: { type: "list<mixed>" }
    }
}`}
                            />
                        ),
                        active: true,
                    },
                    {
                        label: "Typescript Builder",
                        content: (
                            <CodeBlock
                                height={"140px"}
                                value={`const schema = K.schema({
    s: K.listString(),
    n: K.listNumber(),
    b: K.listBoolean(),
    m: K.listMixed(),
});`}
                            />
                        ),
                    },
                ]}
            />

            <Spacer />

            <H1>Array type</H1>
            <p>
                Category: <Code>Node</Code> <Code>Non-Answerable</Code>
            </p>
            <p>
                An array type is a special type that allows you to store
                multiple values of the same type. It is a non-answerable because
                you can't answer it directly, only each item in the array can be
                answered.
            </p>
            <p>
                Ideal for repeatable fields like addresses or tags. Arrays can
                be nested inside other array types to create complex data
                structures. Use <Code>items</Code> to specify shape of the array
                items.
            </p>
            <p>
                <CodeTabs
                    tabs={[
                        {
                            label: "JSON Schema",
                            content: (
                                <CodeBlock
                                    height={"300px"}
                                    value={`const schema = {
    __: {
        persons: { 
            type: "array",
            items: {
                type: "object",
                __: {
                    name: { type: "string" },
                    age: { type: "number" }
                }
            }
        }
    }
}`}
                                />
                            ),
                            active: true,
                        },
                        {
                            label: "Typescript Builder",
                            content: (
                                <CodeBlock
                                    height={"180px"}
                                    value={`const schema = K.schema({
    persons: K.array(
        K.object({
            name: K.string(),
            age: K.number(),
        }),
    ),
});`}
                                />
                            ),
                        },
                    ]}
                />
            </p>

            <Spacer />

            <H1>Null type</H1>
            <p>
                Category: <Code>Leaf</Code> <Code>Non-Answerable</Code>
            </p>
            <p>
                The null type is a special type that represents the absence of a
                value. It is non-answerable because you cannot directly answer
                it. Some form renderer need this for displaying stuff between
                properties.
            </p>

            <CodeTabs
                tabs={[
                    {
                        label: "JSON Schema",
                        content: (
                            <CodeBlock
                                height={"160px"}
                                value={`const schema = {
    __: {
        intro: { 
            type: "null",
        }
    }
}`}
                            />
                        ),
                        active: true,
                    },
                    {
                        label: "Typescript Builder",
                        content: (
                            <CodeBlock
                                height={"80px"}
                                value={`const schema = K.schema({
    intro: K.null(),
});`}
                            />
                        ),
                    },
                ]}
            />
        </DocLayout>
    );
}
