import { CodeTabs } from "@/components/code-tabs";
import { H1, Spacer } from "@/components/html";
import { Snippet } from "@/components/snippet";
import { GettingStarted } from "@/doc/getting-started.meta";
import { DocLayout } from "@/layouts/doc-layout";

export default function () {
    return (
        <DocLayout meta={GettingStarted}>
            <H1>Getting started</H1>

            <Spacer />
            <p>Install Kofono using your preferred package manager:</p>
            <CodeTabs
                tabs={[
                    {
                        label: "PNPM",
                        active: true,
                        content: <Snippet value={`{primary:pnpm} {success:add kofono}`} language="bashfile" />,
                    },
                    {
                        label: "NPM",
                        content: <Snippet value={`{primary:npm} {success:i kofono}`} language="bashfile" />,
                    },
                ]}
            />
            <small>Node version 22 or higher is required.</small>
        </DocLayout>
    );
}
