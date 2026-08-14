import { PropertyType } from "kofono";
import { For } from "solid-js";
import type { UpdateHandler } from "@/components/types";
import { useFormContext } from "@/context/helpers";
import { GridPropLayout } from "./GridPropLayout";
import { GridPropObjectWrapper } from "./GridPropObjectWrapper";

export interface GridPropertiesLayoutProps {
    updateHandler: UpdateHandler;
    selectors: string[];
}

export function GridPropsLayout(props: GridPropertiesLayoutProps) {
    const { store } = useFormContext();
    return (
        <For each={props.selectors}>
            {selector => {
                if (store.form!.props[selector].type === PropertyType.Object) {
                    return (
                        <GridPropObjectWrapper selector={selector}>
                            <GridPropsLayout
                                updateHandler={props.updateHandler}
                                selectors={store
                                    .form!.prop(selector)
                                    .getChildrenSelectors()}
                            />
                        </GridPropObjectWrapper>
                    );
                }
                return (
                    <GridPropLayout
                        data-test={store.form?.state.sessionId}
                        updateHandler={props.updateHandler}
                        selector={selector}
                    />
                );
            }}
        </For>
    );
}
