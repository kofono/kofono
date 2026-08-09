import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("Base64Validator", () => {
    let form: Form;
    it("test base64 regex", async () => {
        form = await K.form({
            propA: K.string("base64"),
        });
        expect(form.isPropValid("propA")).toBeTruthy();
        await form.update("propA", "not_base64!");
        expect(form.isPropValid("propA")).toBeFalsy();
        expect(form.state.validations).toEqual({
            propA: [false, "_BASE64_INVALID"],
        });
        await form.update("propA", "SGVsbG8gV29ybGQ=");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("Base64urlValidator", () => {
    let form: Form;
    it("test base64url regex", async () => {
        form = await K.form({
            propA: K.string("base64url"),
        });
        expect(form.isPropValid("propA")).toBeTruthy();
        await form.update("propA", "not+base64/url=");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "SGVsbG8gV29ybGQ");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});
