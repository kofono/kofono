import { expect, test } from "vitest";
import {
    getParentSelector,
    getParentSelectors,
    joinSelectors,
    removeSelectorBase,
    resolvePartialSelectors,
} from "./helpers";

test("joinSelectors()", () => {
    expect(joinSelectors("a", "b")).toBe("a.b");
});

test("removeSelectorBase()", () => {
    expect(removeSelectorBase("a", "a.b.c")).toBe("b.c");
});

test("getParentSelector()", () => {
    expect(getParentSelector("a.b.c")).toBe("a.b");
    expect(getParentSelector("a")).toBe("");
    expect(getParentSelector("...")).toBe("..");
});

test("parentSelectors()", () => {
    for (const sel of getParentSelectors("a.b.c.d")) {
        ["a.b.c", "a.b", "a"].includes(sel);
    }

    let i = 0;
    getParentSelectors("").map(() => i++);
    expect(i).toBe(0);
});

test("resolvePartialSelectors()", () => {
    expect(
        resolvePartialSelectors("a", [".b", ".c", ".d", "foo", ".e.f"]),
    ).toEqual(["a.b", "a.c", "a.d", "foo", "a.e.f"]);
});
