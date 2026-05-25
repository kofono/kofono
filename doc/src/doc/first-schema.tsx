import { CodeBlock } from "@/components/code-block";
import { CodeTabs } from "@/components/code-tabs";
import { Code, H1, List, Spacer } from "@/components/html";
import { FirstSchema } from "@/doc/first-schema.meta";
import { DocLayout } from "@/layouts/doc-layout";

export default function () {
    return (
        <DocLayout meta={FirstSchema}>
            <H1>Create your first schema</H1>
            <p>So lets create your first schema. We have two choices:</p>
            <List>
                <li>Use JSON syntax</li>
                <li>
                    Use Kofono <Code>K</Code> builder
                </li>
            </List>
            <p>
                Through the documentation, you will see both syntax, but generally, we recommend using the Kofono{" "}
                <Code>K</Code> builder as it offers a more intuitive and concise way to define schemas. It has also the
                benefit of being computed to a JSON schema with <Code>K.schema()</Code>.{" "}
            </p>
            <Spacer />
            <CodeTabs
                tabs={[
                    {
                        label: "JSON Schema",
                        content: (
                            <CodeBlock
                                value={`import { Schema } from "kofono"

export const intro: Schema = {
    $id: "my-form",
    __: {
        firstName: {
            type: "string",
            $v: [{ between:{ min: 1, max: 255 }],
        },
        lastName: {
            type: "string",
            $v: [{ between:{ min: 1, max: 255 }],
        },
        mainContact: {
            type: "string",
            $v: ["email"],
        }
    },
};`}
                            />
                        ),
                        active: true,
                    },
                    {
                        label: "Typescript Builder",
                        content: (
                            <CodeBlock
                                value={`import { K, between, email } from "kofono";

export const schema = K.schema({
    $id: "my-form",
    firstName: K.string(between(1, 255)),
    lastName: K.string(between(1, 255)),
    mainContact: K.string(email()),
}`}
                            />
                        ),
                    },
                ]}
            />
            <p>
                This is a basic example of a schema. It defines a form with id "my-form" and with three fields(aka
                properties): <br />
                <Code>firstName</Code>, <Code>lastName</Code>, and <Code>mainContact</Code>.
            </p>
            <p>
                By essence, the schema represent a way to describe your form structure, validations and business logics.
                It can be stored in database or in file easily.
            </p>
            <p>
                In this example,
                <Code>firstName</Code> and <Code>lastName</Code> must be a string of max 255 characters and at least one
                character. <br />
                <Code>mainContact</Code> must be a valid email address string.
            </p>
            <p>To actually use the schema, you will need to create a form instance. This is where the magic happens.</p>
        </DocLayout>
    );
}

/**

 With that in place, you
                will be able to use the schema to render your form in frontend but you will also be able to reuse it in
                the backend for validation and other purposes.
 */
