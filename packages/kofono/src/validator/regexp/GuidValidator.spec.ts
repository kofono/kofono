import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("guid validator", () => {
    let form: Form;
    it("test guid regex", async () => {
        form = await K.form({
            a: K.string("guid"),
        });
        expect(form.isPropValid("a")).toBeFalsy();
        await form.update("a", "123e4567-e89b-12d3-a456-426614174000");
        expect(form.isPropValid("a")).toBeTruthy();
    });
});
