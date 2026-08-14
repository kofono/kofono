import { DataSelector, type Form } from "kofono";

export function getRootSelectors(form: Form): string[] {
    const selectors: string[] = [];
    for (const selector of form.propsKeys()) {
        if (!selector.includes(DataSelector.separator)) {
            selectors.push(selector);
        }
    }
    return selectors;
}

export function getParentLevel(selector: string): number {
    return selector.split(DataSelector.separator).length - 1;
}
