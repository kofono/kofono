import { CodeBlock } from "@/components/code-block";
import { CodeTabs } from "@/components/code-tabs";
import { H1, Spacer, StrongAccent } from "@/components/html";
import { DocLayout } from "@/layouts/doc-layout";
import { Introduction } from "@/pages/introduction.meta";

export default function () {
    return (
        <DocLayout meta={Introduction}>
            <H1 class="font-bold text-4xl">Kofono documentation</H1>
            <H1>What is Kofono?</H1>

            <p>
                Kofono is a <StrongAccent>headless form engine</StrongAccent> for TypeScript. You define forms with a
                schema-first approach. This let you validate them frontend/backend without duplicating logic.
            </p>

            {/*<CodeBlock*/}
            {/*    height={"150px"}*/}
            {/*    value={}*/}
            {/*/>*/}

            <CodeTabs
                tabs={[
                    {
                        label: "JSON Schema",
                        content: (
                            <CodeBlock
                                height={"750px"}
                                value={`export const intro: Schema = {
    $id: "my-form",
    __: {
        name: {
            type: "string",
            $v: ["required"],
        },
        product: {
            type: "string",
            $v: ["required"],
            enum: ["product1", "product2", "product3"],
        },
        dimension: {
            type: "object",
            __: {
                width: {
                    type: "number",
                    $v: [{ min: 1 }],
                },
                height: {
                    type: "number",
                    $v: [{ min: 1 }],
                },
            },
        },
        quantity: {
            type: "number",
            $v: [{ min: 5 }, { max: 20 }],
            default: 5,
        },
        consent: {
            type: "boolean",
            $v: ["isTrue"],
            default: false,
        },
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
                                height={"225px"}
                                value={`const schema = K.schema({
    $id: "my-form",
    name: K.string(required()),
    product: K.string(required()).enum(["product1", "product2", "product3"]),
    dimension: K.object({
        width: K.number(min(1)),
        height: K.number(min(1)),
    }),
    quantity: K.number(min(5), max(20)).default(5),
    consent: K.boolean(required()).default(false),
}`}
                            />
                        ),
                    },
                ]}
            />

            <Spacer />

            <H1>Why Kofono</H1>
            <p>
                Forms are essential and often fragile. Kofono centralizes structure, validation, and types so your forms
                stay predictable and maintainable as requirements grow.
            </p>
            <ul class="list-disc pl-5 flex flex-col gap-3">
                <li>
                    <StrongAccent>Strongly typed schemas</StrongAccent>: describe your data once and get end-to-end type
                    safety.
                </li>
                <li>
                    <StrongAccent>Complex flows</StrongAccent>: conditionals, nested objects/arrays, dynamic defaults,
                    and more.
                </li>
                <li>
                    <StrongAccent>Single source of truth</StrongAccent>: reuse the same schema for UI rendering, server
                    validation, and tests.
                </li>
                <li>
                    <StrongAccent>Validation engine</StrongAccent>: built-in rules plus custom validators you control.
                </li>
                <li>
                    <StrongAccent>Headless</StrongAccent>: bring your own UI (React, Vue, Svelte, vanilla) or render on
                    the server.
                </li>
                <li>
                    <StrongAccent>Extensible</StrongAccent>: compose plugins, validators, and custom renderers without
                    forking the core.
                </li>
            </ul>

            <Spacer />
        </DocLayout>
    );
}
