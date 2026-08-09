import { expect as e, test } from "vitest";
import { K } from "../../src";

test("test prop var ref", async () => {
    const form = await K.form({
        name: K.string("notEmpty"),
        qty: K.number({
            between: {
                min: 1,
                max: 10,
                error: "number between 1 and 10 only",
            },
        }),
    });

    const name = form.prop("name");
    e(name.isValid()).toBeFalsy();
    await form.update("name", "John Doe");
    e(name.isValid()).toBeTruthy();
});
