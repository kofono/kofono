import { Editor } from "@kofono/solid-editor";
import {
    ComponentType,
    FormSchemaProvider,
    GridForm
} from "@kofono/solid-form";
import { K, max, min, type Schema } from "kofono";
import { createSignal, Show } from "solid-js";
import { H1, H4, Hr } from "@/components/html";
import { FullScreenLayout } from "@/layouts/fullscreen-layout";
import { cn } from "@/utils";
import { evalWithContext } from "./schema";

/*

K.schema({
    name: K.string(
            min(1, "Your name must be at least 1 character"),
            max(250, "Your name should not exceed 250 characters!"),
        )
        .component({
            title: "Enter your ndfsdfsdfsdfame",
            description: "Please enter your name",
        }),

    acceptTerms: K.boolean(required()).component({
        type: "checkbox2",
        title:"DO you surrender your soul?"
    })
})
 */

const startingSchemaString = `K.schema({
    name: K.string(
            min(1, "Your name must be at least 1 character"),
            max(250, "Your name should not exceed 250 characters!"),
        )
        .component({
            title: "Enter your ndfsdfsdfsdfame",
            description: "Please enter your name",
        }),

    acceptTerms: K.boolean(required()).component({
        type: "checkbox2",
        title:"DO you surrender your soul?"
    })
})`;
startingSchemaString;

const schema = K.schema({
    name: K.string(min(1, "name.min.error"), max(250, "name.max.error")).component({
        type: ComponentType.Input,
        title: "name.title",
        description: "name.description",
    }),
    $translations: {
        en: {
            name: {
                title: "Enter your name",
                description: "Enter your first name only",
                "min.error": "Your name must be at least 1 character",
                "max.error": "Your name should not exceed 250 characters!",
            },
        },
    },
});

export default function () {
    // const [value, setValue] = createSignal<string>(startingSchemaString);
    const [previewSchema, setPreviewSchema] = createSignal<Schema>(schema);
    const [previewSchemaVersion, setPreviewSchemaVersion] = createSignal(1);
    const [doesParse, setDoesParse] = createSignal(false);

    const onEditorChange = (val: string) => {
        console.log("onEditorChange");
        try {
            const schema = evalWithContext(val);
            updateSchema(schema);
            setDoesParse(true);
        } catch (error) {
            console.error(error);
            setDoesParse(false);
        }
    };

    const updateSchema = (nextSchema: Schema) => {
        setPreviewSchema(nextSchema);
        setPreviewSchemaVersion(v => v + 1);
    };

    const reloadBtn = () => {
        updateSchema(previewSchema());
    };

    return (
        <FullScreenLayout>
            <H1>Playground</H1>
            <div class="flex flex-row justify-between gap-2">
                <div class="flex-3/5 p-2">
                    <div class="tabs tabs-lift">
                        <input
                            type="radio"
                            name="my_tabs_1"
                            class={cn(
                                "tab tab-active text-base-100 checked:[--tab-bg:var(--color-primary)]",
                                !doesParse() && "bg-(--color-error) checked:[--tab-bg:var(--color-error)]",
                            )}
                            aria-label="Schema"
                            checked={true}
                        />
                        <div
                            class={cn(
                                "tab-content relative border-base-300 bg-(--color-primary) p-1",
                                !doesParse() && "bg-(--color-error)/10",
                            )}>
                            <Editor
                                onChange={onEditorChange}
                                class="p-0"
                                value={startingSchemaString}
                                mode={"javascript"}
                                theme="github_dark"
                                style={{
                                    height: "calc(100vh - 220px)",
                                    width: "100%",
                                    backgroundColor: "black",
                                }}
                                options={{
                                    showPrintMargin: false,
                                    showLineNumbers: true,
                                    showFoldWidgets: true,
                                    showGutter: true,
                                    highlightActiveLine: false,
                                }}
                            />
                        </div>

                        <input type="radio" name="my_tabs_1" class="tab" aria-label="Tab 2" />
                        <div class="tab-content border-base-300 bg-base-100 p-10">Tab content 2</div>

                        <input type="radio" name="my_tabs_1" class="tab" aria-label="Tab 3" />
                        <div class="tab-content border-base-300 bg-base-100 p-10">Tab content 3</div>
                    </div>
                    <button class="hidden" type="button" onClick={reloadBtn}>
                        reload
                    </button>
                    <Hr class="-mx-2 my-3" />
                </div>
                <div class="flex-2/5 bg-base-200 p-2">
                    <H4>Preview</H4>
                    <Hr class="-mx-2 my-3" />
                    <Show when={previewSchemaVersion()} keyed>
                        {_version => (
                            <FormSchemaProvider schema={previewSchema()} locale={"en"}>
                                <GridForm />
                            </FormSchemaProvider>
                        )}
                    </Show>
                </div>
            </div>
        </FullScreenLayout>
    );
}
