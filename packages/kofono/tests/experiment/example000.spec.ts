import { expect, test } from "vitest";
import { K, max } from "../../src";

// template
test("test example000", async () => {
    const form = await K.form({
        $id: "myform",
        age: K.number(max(100)),
    });
    expect(form.id).toBe("myform");
});
