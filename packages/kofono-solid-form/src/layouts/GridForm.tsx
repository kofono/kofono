import type { Form } from "kofono";
import { Show, Suspense } from "solid-js";
import { unwrap } from "solid-js/store";
import { FormSubmitButton } from "@/components/button/FormSubmitButton";
import { LanguageSelector } from "@/components/languageSelector";
import { updateHandler as baseUpdateHandler } from "@/components/reactivity";
import { useFormContext } from "@/context";
import { useTranslator } from "@/i18n";
import { GridPropsLayout } from "@/layouts/grid/GridPropsLayout";
import "../index.css";
import { getRootSelectors } from "@/libs";

export interface GridFormProps {
    submit?: (form: Form) => Promise<void> | void;
    cancel?: (form: Form) => Promise<void> | void;
    showThemeSelector?: boolean;
    showLanguageSelector?: boolean;
}

export function GridForm(props: GridFormProps) {
    const { store, setState, setFocusedSelector } = useFormContext();
    const t = useTranslator();

    const submit = async f => {
        if (props.submit) {
            await props.submit(f);
        }
    };

    const updateHandler = async (selector: string, value: any) => {
        if (!store.form) {
            return;
        }
        const ripples = await baseUpdateHandler(
            store.form,
            store.propsSignals!,
            selector,
            value,
        );
        console.log(ripples, " RIPPLES for", selector);

        setState(unwrap(store.form!.state));
        setFocusedSelector(selector);
    };

    return (
        <div style={{ isolation: "isolate" }}>
            <Suspense fallback={<div>{t("loading.form")}...</div>}>
                <Show when={store.form !== null}>
                    <div class="flex justify-end-safe gap-x-4">
                        <Show when={props.showLanguageSelector}>
                            <div>
                                <span class="mr-2 leading-10">
                                    {t("language")}:
                                </span>
                                <LanguageSelector />
                            </div>
                        </Show>
                    </div>
                    <div
                        class={`isolate grid grid-cols-12 gap-[var(--grid-gap)]`}>
                        <GridPropsLayout
                            updateHandler={updateHandler}
                            selectors={getRootSelectors(store.form!)}
                        />
                        <Show when={props.submit}>
                            <div class="col-start-12 content-end p-2">
                                <div class="flex justify-end text-right">
                                    <Show when={props.cancel}>
                                        {t("cancel")}
                                    </Show>
                                    <FormSubmitButton submit={submit} />
                                </div>
                            </div>
                        </Show>
                    </div>
                </Show>
            </Suspense>
        </div>
    );
}
