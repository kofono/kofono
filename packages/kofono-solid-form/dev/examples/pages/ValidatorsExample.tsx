import {
    alpha,
    alphaNum,
    between,
    datetime,
    equal,
    K,
    type Schema,
} from "kofono";
import { For } from "solid-js";
import type { InputComponent } from "@/components/input";
import { C } from "@/components/PropElement";
import { ExamplePage } from "../ExamplePage";

const translations = {
    en: {},
    fr: {},
};

const schema: Schema = K.schema({
    $id: "validators-example",
    $translations: translations,

    alpha: K.object({
        intro: K.null().component({
            type: C.Paragraph,
            title: "<h1>Alpha</h1>",
            content: <Option opts={{ "spaces?": "boolean" }} />,
            grid: 12,
        }),
        a: K.string(alpha({ spaces: false })).component<InputComponent>({
            type: C.Input,
            title: "Letters only",
            subTitle: "A-Za-z, no spaces allowed - default behaviour",
            grid: 6,
        }),
        b: K.string(alpha({ spaces: true })).component<InputComponent>({
            type: C.Input,
            title: "Letters only w/o spaces",
            subTitle: "A-Za-z, with spaces allowed",
            grid: 6,
        }),
    }),

    alphaNum: K.object({
        intro: K.null().component({
            type: C.Paragraph,
            title: "AlphaNum",
            content: <Option opts={{ "spaces?": "boolean" }} />,
            grid: 12,
        }),
        a: K.string(alphaNum({ spaces: false })).component<InputComponent>({
            type: C.Input,
            title: "Letters and numbers only",
            subTitle: "A-Za-z0-9, no spaces allowed - default behaviour",
            grid: 6,
        }),
        b: K.string(alphaNum({ spaces: true })).component<InputComponent>({
            type: C.Input,
            title: "Letters and numbers only w/o spaces",
            subTitle: "A-Za-z0-9, with spaces allowed",
            grid: 6,
        }),
    }),

    between: K.object({
        intro: K.null().component({
            type: C.Paragraph,
            title: "Between",
            content: <Option opts={{ "min?": "number", "max?": "number" }} />,
            grid: 12,
        }),
        a: K.number().validations(between(10, 90)).component<InputComponent>({
            type: C.Input,
            inputType: "number",
            title: "With number",
            subTitle: "Enter a number between 10 and 20",
            placeholder: "Enter a number between 10 and 20",
            grid: 6,
        }),
        b: K.string().validations(between(10, 20)).component<InputComponent>({
            type: C.Input,
            inputType: "text",
            title: "With string",
            subTitle: "Text length must be between 10 and 20",
            placeholder: "10 and 20 characters max",
            grid: 6,
        }),
    }),

    datetime: K.object({
        intro: K.null().component({
            type: C.Paragraph,
            title: "Datetime",
            content: (
                <Option
                    opts={{
                        format: "string",
                        "min?": "string",
                        "max?": "string",
                    }}
                />
            ),
            grid: 12,
        }),
        a: K.string(
            datetime({
                format: "yyyy-MM-dd",
            }),
        ).component<InputComponent>({
            type: C.Input,
            inputType: "date",
            title: "With format",
            subTitle: "format: yyyy-MM-dd",
            placeholder: "yyyy-mm-dd",
            grid: 6,
        }),
        b: K.string(
            datetime({
                format: "yyyy-MM-dd",
                max: "2026-12-31",
                min: "2026-01-01",
            }),
        ).component<InputComponent>({
            type: C.Input,
            inputType: "date",
            title: "With format, min and max",
            subTitle: "format: yyyy-MM-dd, min: 2026-01-01, max: 2026-12-31",
            grid: 6,
        }),
    }),

    email: K.object({
        intro: K.null().component({
            type: C.Paragraph,
            title: "Email",
            content: "No options",
            grid: 12,
        }),
        a: K.string("email").component<InputComponent>({
            type: C.Input,
            subType: "email",
            title: "",
            subTitle: "Enter a valid email address",
            placeholder: "your@email.com",
            grid: 12,
        }),
    }),

    equal: K.object({
        intro: K.null().component({
            type: C.Paragraph,
            title: "Equal",
            content: (
                <Option opts={{ value: "any", "caseSensitive?": "boolean" }} />
            ),
            grid: 12,
        }),
        a: K.string(
            equal("hello", { caseSensitive: false }),
        ).component<InputComponent>({
            type: C.Input,
            subType: "text",
            title: "With case insensitive",
            subTitle: "Should be equal to 'hello'",
            placeholder: "hello",
            grid: 6,
        }),
        b: K.string(
            equal("HELLO", { caseSensitive: true }),
        ).component<InputComponent>({
            type: C.Input,
            subType: "text",
            title: "With case sensitive",
            subTitle: "Should be equal to 'HELLO'",
            placeholder: "HELLO",
            grid: 6,
        }),
    }),
});

export function ValidatorsExample() {
    return <ExamplePage schema={schema} submit={f => console.log(f.state)} />;
}

function Option(props: { opts: Record<string, any> }) {
    const lastKey = Object.keys(props.opts).pop();
    return (
        <code class="text-[0.90rem]">
            &#123;&nbsp;
            <For each={Object.entries(props.opts)}>
                {([k, v]) => (
                    <>
                        <strong class="text-primary">{k}</strong>:{" "}
                        <span class="text-muted">
                            {String(v)}
                            {k === lastKey ? "" : ", "}
                        </span>
                    </>
                )}
            </For>
            &nbsp;&#125;
        </code>
    );
}
