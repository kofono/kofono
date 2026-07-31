import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("LowercaseValidator", () => {
    let form: Form;
    it("test lowercase regex", async () => {
        form = await K.form({
            propA: K.string("lowercase"),
        });
        // empty string still respects the validation
        expect(form.isPropValid("propA")).toBeTruthy();
        await form.update("propA", "ABC");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "abc sfg");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("UppercaseValidator", () => {
    let form: Form;
    it("test uppercase regex", async () => {
        form = await K.form({
            propA: K.string("uppercase"),
        });
        expect(form.isPropValid("propA")).toBeTruthy();
        await form.update("propA", "abc");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "ABC SDF3");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("HexValidator", () => {
    let form: Form;
    it("test hex regex", async () => {
        form = await K.form({
            propA: K.string("hex"),
        });
        expect(form.isPropValid("propA")).toBeTruthy();
        await form.update("propA", "xyz123");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "ABCDEF0123456789");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});
