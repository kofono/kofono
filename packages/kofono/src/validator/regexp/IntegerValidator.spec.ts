import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("integer validator", () => {
    let form: Form;
    it("test integer regex", async () => {
        form = await K.form({
            a: K.number("integer"), // default value is 0
        });
        expect(form.isPropValid("a")).toBeTruthy();
        await form.update("a", 3.14);
        expect(form.isPropValid("a")).toBeFalsy();
    });
});
