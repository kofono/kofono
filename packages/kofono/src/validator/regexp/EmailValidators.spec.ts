import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("EmailValidator", () => {
    let form: Form;
    it("test email regex", async () => {
        form = await K.form({
            propA: K.string("email"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "not-an-email");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "john.doe@example.com");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("Html5EmailValidator", () => {
    let form: Form;
    it("test html5Email regex", async () => {
        form = await K.form({
            propA: K.string("html5Email"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "not-an-email");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "john.doe@example.com");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("Rfc5322EmailValidator", () => {
    let form: Form;
    it("test rfc5322Email regex", async () => {
        form = await K.form({
            propA: K.string("rfc5322Email"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "not-an-email");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "john.doe@example.com");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});
