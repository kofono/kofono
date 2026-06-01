import { expect, test } from "vitest";
import { allTypes } from "../../tests/_fixtures/schemas/allTypes";

import { buildSchema } from "../builder/helpers";
import { K } from "../builder/K";
import { notEmpty } from "../validator/empty/NotEmptyValidator";
import { isValid } from "../validator/isValid/IsValidValidator";

test("FormStats initialization", async () => {
    const form = await buildSchema(allTypes);
    expect(form.state.stats).toEqual({
        invalid: 0,
        leaf: 9,
        node: 2,
        progression: 100,
        qualified: 9,
        valid: 9,
    });
});

test("FormStats validations and qualifications", async () => {
    const form = await K.form({
        propA: K.string(notEmpty()), // on start: not valid, qualified
        propB: K.string().qualifications(isValid("propA")), // on start: not valid, not qualified
        propC: K.string(notEmpty()), // on start: not valid, qualified
        propD: K.number(), // on start: valid, qualified
        propE: K.number(notEmpty()).default(1), // on start: valid, qualified
    });

    expect(form.state.stats).toEqual({
        invalid: 2,
        leaf: 5,
        node: 0,
        progression: 50,
        qualified: 4,
        valid: 2,
    });

    await form.update("propA", "foo");

    expect(form.state.stats).toEqual({
        invalid: 1,
        leaf: 5,
        node: 0,
        progression: 80,
        qualified: 5,
        valid: 4,
    });
});

test("FormStats cache update when property added / deleted", async () => {
    const form = await K.form({
        propA: K.array(K.string()),
    });

    expect(form.state.stats).toEqual({
        invalid: 0,
        leaf: 0,
        node: 1,
        progression: 0,
        qualified: 0,
        valid: 0,
    });

    await form.array.expand("propA");

    expect(form.state.stats).toEqual({
        invalid: 0,
        leaf: 1,
        node: 1,
        progression: 100,
        qualified: 1,
        valid: 1,
    });
});

test("FormStats progression rounding", async () => {
    const form = await K.form({
        propA: K.string(notEmpty()).default("foo"),
        propB: K.string(notEmpty()),
        propC: K.string(notEmpty()),
    });

    expect(form.state.stats).toEqual({
        invalid: 2,
        leaf: 3,
        node: 0,
        progression: 33,
        qualified: 3,
        valid: 1,
    });
});
