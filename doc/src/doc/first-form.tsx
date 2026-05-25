import { CodeBlock, CodeBlockLarge } from "@/components/code-block";
import { CodeTabs } from "@/components/code-tabs";
import { Code, H1, H2, Spacer } from "@/components/html";
import { FirstForm } from "@/doc/first-form.meta";
import { DocLayout } from "@/layouts/doc-layout";

export default function () {
    return (
        <DocLayout meta={FirstForm}>
            <H1>Create you first form</H1>
            <Spacer />
            <p>
                Let's create our first form with Kofono by reusing the schema we created in the previous section. But
                instead of using <Code>K.schema()</Code>, we will use <Code>K.form()</Code>.
            </p>
            <p>A form instance allows us to interact with the form data in real-time.</p>
            <CodeTabs
                tabs={[
                    {
                        label: "JSON Schema",
                        content: (
                            <CodeBlock
                                value={`import { K } from "kofono"

const form = await K.form({
    $id: "my-form",
    __: {
        firstName: {
            type: "string",
            $v: ["required", { max: 255 }],
        },
        lastName: {
            type: "string",
            $v: ["required", { max: 255 }],
        },
        mainContact: {
            type: "string",
            $v: ["email"],
        }
    },
};`}
                            />
                        ),
                    },
                    {
                        active: true,
                        label: "Typescript Builder",
                        content: (
                            <CodeBlock
                                value={`import { K, required, max } from "kofono";

const form = await K.form({
    $id: "my-form",
    firstName: K.string(required(), max(255)),
    lastName: K.string(required(), max(255)),
    mainContact: K.string(email()),
}`}
                            />
                        ),
                    },
                ]}
            />

            <p>Once the form is created, you can interact with it by accessing its properties and updating its data.</p>

            <Spacer />
            <H2>Update a property</H2>
            <CodeBlockLarge class="p-0" value={`await form.update("firstName", "John");`} />

            <Spacer />
            <H2>Access to property informations</H2>
            <CodeBlockLarge
                class="p-0"
                value={`const firstName = form.prop("firstName");
firstName.isValid();
firstName.isQualified();
firstName.value;
firstName.validationError;
//...
`}
            />

            <Spacer />
            <H2>Check if the form is valid</H2>
            <CodeBlockLarge
                class="p-0"
                value={`if (form.pass()) {
    //...
} else {
    console.log(form.errors());
}`}
            />

            <Spacer />
            <H2>Access to the form state</H2>
            <CodeBlockLarge
                class="p-0"
                value={`console.log(form.state);
/*
{
    sessionId: '69f9353f-81c1-4af0-b762-c810529cfbad',
    data: { firstName: 'John', lastName: null, mainContact: null },
    stats: {
        qualified: 3,
        valid: 1,
        invalid: 2,
        progression: 33.33333333333333,
        node: 0,
        leaf: 3
    },
    meta: { hasBeenUpdated: [ 'firstName' ], extensions: [] },
    pass: [ false, '_FORM_NOT_COMPLETE' ],
    qualifications: {
        firstName: [ true, '' ],
        lastName: [ true, '' ],
        mainContact: [ true, '' ]
    },
    validations: {
        firstName: [ true, '' ],
        lastName: [ false, '_REQUIRED_IS_REQUIRED' ],
        mainContact: [ false, '_EMAIL_INVALID_TYPE' ]
    }
}
*/`}
            />
        </DocLayout>
    );
}
