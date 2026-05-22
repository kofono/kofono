import { Title } from "@solidjs/meta";
import { CodeBlock } from "@/components/code-block";
import { H1 } from "@/components/html";
import { DocLayout } from "@/layouts/doc-layout";

export const SchemaSelectors: DocComponentPage = {
    path: "/schema/selectors",
    title: "Schema Selectors",
    menuTitle: "Selectors",
    description: "",
    keywords: [],
    component: RouteComponent,
};

function RouteComponent() {
    return (
        <DocLayout>
            <Title>{SchemaSelectors.title}</Title>
            <H1>Selectors</H1>
            <p>
                Selector are important concept and they are used in many way.
                Each property have a selector assigned to it that can be used as
                reference to this property. Just remember that selectors are
                automatically generated based from position in the schema using
                dot notation.
            </p>
            <p>
                Selectors will become handy later with validation and
                qualifications and form instance:
            </p>
            <CodeBlock
                height={"380px"}
                value={`const schema: Schema = {
    __: {
        address: {
            type: "object",
            __: {
                street: { type: "string" },
                city: { type: "string" },
                location: {
                    type: "object",
                    __: {
                        lat: { type: "number" },
                        lng: { type: "number" }
                    }
                }
            }
        }
    }            
}`}
            />
            Here the selectors of answerable properties of the example above:
            <ul>
                <li>
                    <code>address.street</code>
                </li>
                <li>
                    <code>address.city</code>
                </li>
                <li>
                    <code>address.location.lat</code>
                </li>
                <li>
                    <code>address.location.lng</code>
                </li>
            </ul>
        </DocLayout>
    );
}
