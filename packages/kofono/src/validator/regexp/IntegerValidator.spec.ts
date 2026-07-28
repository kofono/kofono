import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("integer validator", () => {
    let form: Form;
    it("test integer regex", async () => {
        form = await K.form({
            a: K.number("integer").default(3.14),
        });
        expect(form.isPropValid("a")).toBeFalsy();
        await form.update("a", 4);
        expect(form.isPropValid("a")).toBeTruthy();
    });
});
