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
            <div role="alert" class="alert alert-info alert-soft">
                <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    class="h-6 w-6 shrink-0 stroke-current">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Node version 22 or higher is required.</span>
            </div>
        </DocLayout>
    );
}
