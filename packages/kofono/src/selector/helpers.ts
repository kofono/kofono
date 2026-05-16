import { DataSelector } from "./DataSelector";

/**
 * Concatenate selectors with the separator.
 * ex: joinSelectors("a", "b", "c") => "a.b.c"
 */
export function joinSelectors(...selectors: string[]): string {
    return selectors.join(DataSelector.separator);
}

/**
 * Join the parent selector with the selector.
 * If the parent selector is "root" or empty, the selector is returned as is.
 * ex: joinParentSelector("a", "b") => "a.b"
 */
export function joinParentSelector(
    parentSelector: string,
    selector: string,
): string {
    if (parentSelector === "root" || parentSelector === "") {
        return selector;
    }
    return joinSelectors(parentSelector, selector);
}

/**
 * Remove the base selector from the selector.
 * ex: removeSelectorBase("a", "a.b.c") => "b.c"
 */
export function removeSelectorBase(
    baseSelectorToRemove: string,
    selector: string,
) {
    return selector.replace(baseSelectorToRemove + DataSelector.separator, "");
}

/**
 * Get the parent selector.
 * ex: getParentSelector("a.b.c") => "a.b"
 */
export function getParentSelector(selector: string): string {
    const parts = selector.split(DataSelector.separator);
    return parts.slice(0, parts.length - 1).join(DataSelector.separator);
}

/**
 * Generator for looping over the parent(s) of a given selector
 */
export function* parentSelectors(selector: string): Generator<string> {
    let parts = selector.split(DataSelector.separator).slice(0, -1);
    while (parts.length > 0) {
        yield joinSelectors(...parts);
        parts = parts.slice(0, -1);
    }
}

/**
 * Resolve partial selectors from the base selector.
 */
export function resolvePartialSelectors(
    baseSelector: string,
    selectors: string[],
): string[] {
    // const resolvedSelector: string[] = [];
    // const parent = getParentSelector(baseSelector);
    // for (const sel of selectors) {
    //     resolvedSelector.push(sel.startsWith(DataSelector.separator) ? `${parent}${sel}` : sel);
    // }
    // return resolvedSelector;

    return selectors.map(sel =>
        sel.startsWith(DataSelector.separator) ? `${baseSelector}${sel}` : sel,
    );
}
