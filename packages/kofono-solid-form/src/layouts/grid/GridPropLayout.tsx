import type { ValidatorResponse } from "kofono";
import { createEffect, createSignal, Show } from "solid-js";
import { ParagraphBase } from "@/components/displayElements";
import { propComponent, propertyHtmlId } from "@/components/helpers";
import { Label } from "@/components/label";
import { PropElement } from "@/components/PropElement";
import type { UpdateHandler } from "@/components/types";
import { useFormContext } from "@/context/helpers";
import { useTranslator } from "@/i18n";
import { gridOption2Classes } from "@/layouts/helpers";
import { getParentLevel } from "@/libs";
import { cn } from "@/libs/cn";
import type { GridSchemaOption } from "../types";

interface GridPropertyLayoutProps {
    updateHandler: UpdateHandler;
    selector: string;
}

export function GridPropLayout(props: GridPropertyLayoutProps) {
    const { store, setPropSignal, setFocusedSelector } = useFormContext();
    const t = useTranslator();

    const [property, setProperty] = createSignal(
        store.form!.prop(props.selector),
    );
    const [validation, setValidation] = createSignal<ValidatorResponse>([
        true,
        "",
    ]);

    const [grid, setGrid] = createSignal<GridSchemaOption>(
        property().get<GridSchemaOption>("component.grid", 12),
    );

    const component = propComponent(property());
    // console.log(property().selector, component.title);

    createEffect(() => {
        const prop = store.form!.prop(props.selector);
        setProperty(prop);
        setGrid(property().get<GridSchemaOption>("component.grid", 12));
        setPropSignal(props.selector, [property, setProperty]);
        setValidation(prop.validation);
    });

    return (
        <Show when={property().isQualified()}>
            {/** biome-ignore lint/a11y/noStaticElementInteractions: ok */}
            {/** biome-ignore lint/a11y/useKeyWithMouseEvents: ok too, trust me bro */}
            <fieldset
                onMouseOver={() => setFocusedSelector(property().selector)}
                class={cn(
                    // "fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4",
                    gridOption2Classes(grid()),
                    "p-4 mr-2 mb-2",
                    getParentLevel(property().selector) === 0 &&
                        "rounded-md border border-(--grid-prop-border) bg-(--grid-prop-bg)",
                    // store.focusedSelector === property().selector &&
                    //     "bg-secondary/10",
                )}>
                <div class="mb-2">
                    <Show when={component.title !== ""}>
                        <Label
                            size="medium"
                            weight="bold"
                            for={propertyHtmlId(property())}>
                            {t(component.title)}
                        </Label>
                    </Show>
                    <Show
                        when={
                            component.title !== "" &&
                            component.getOrDefault("subTitle", null)
                        }>
                        <br />
                    </Show>
                    <Show when={component.getOrDefault("subTitle", null)}>
                        <Label size={`small`} for={propertyHtmlId(property())}>
                            {t(component.getOrDefault("subTitle", ""))}
                        </Label>
                    </Show>
                </div>
                <PropElement
                    property={property}
                    updateHandler={props.updateHandler}
                />
                <Show
                    when={!property().isValid() && property().hasBeenUpdated()}>
                    <ParagraphBase class={`text-error pt-1`}>
                        {/*{t(validaton()[1], 1234)}*/}
                        {t(validation()[1], validation()[2])}
                    </ParagraphBase>
                </Show>
                <Show when={component.description}>
                    <ParagraphBase class={`mt-2 mb-2 pt-1`}>
                        {t(component.description)}
                    </ParagraphBase>
                </Show>
            </fieldset>
        </Show>
    );
}
