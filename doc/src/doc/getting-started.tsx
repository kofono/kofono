import { H1, Spacer } from "@/components/html";
import { DocLayout } from "@/layouts/doc-layout";

export const GettingStarted: DocComponentPage = {
    path: "/getting-started",
    title: "Template example",
    menuTitle: "Getting started",
    description: "",
    keywords: [],
    component: RouteComponent,
};

function RouteComponent() {
    return (
        <DocLayout>
            <H1>Getting started</H1>
            <p>content</p>
            <Spacer />
        </DocLayout>
    );
}
