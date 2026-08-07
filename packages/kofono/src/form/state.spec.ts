import { describe, expect, it } from "vitest";
import { K } from "../builder/K";
import {
    getInvalidSelectors,
    getQualifiedSelectors,
    getUnqualifiedSelectors,
    getValidSelectors,
} from "./state";

describe("FormState getValidSelectors() && getInvalidSelectors()", () => {
    it("should return invalid selectors", async () => {
        const form = await K.form({
            propA: K.string("notEmpty"),
            propB: K.string(),
        });

        expect(getInvalidSelectors(form)).toEqual(["propA"]);
        expect(getValidSelectors(form)).toEqual(["propB"]);

        await form.update("propA", "a");
        expect(getInvalidSelectors(form)).toEqual([]);
        expect(getValidSelectors(form)).toEqual(["propA", "propB"]);
    });
});

describe("FormState getQualifiedSelectors() && getUnqualifiedSelectors()", () => {
    it("should return unqualified selectors", async () => {
        const form = await K.form({
            propA: K.string("notEmpty"),
            propB: K.string().qualifications({ isValid: "propA" }),
        });

        expect(getUnqualifiedSelectors(form)).toEqual(["propB"]);
        expect(getQualifiedSelectors(form)).toEqual(["propA"]);

        await form.update("propA", "a");
        expect(getUnqualifiedSelectors(form)).toEqual([]);
        expect(getQualifiedSelectors(form)).toEqual(["propA", "propB"]);
    });
});
