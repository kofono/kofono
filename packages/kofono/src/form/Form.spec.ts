import { beforeAll, beforeEach, describe, expect, it, test } from "vitest";
import { buildSchema } from "../builder/helpers";
import { K } from "../builder/K";
import { Property } from "../property/Property";
import type { Schema } from "../schema/Schema";
import { notEmptyValidator } from "../validator/empty/NotEmptyValidator";
import { isValidValidator } from "../validator/isValid/IsValidValidator";
import { QualificationError } from "../validator/types";
import { defaultConfig } from "./defaults";
import { Events } from "./events/types";
import { Form } from "./Form";
import { FormStatus, type State } from "./types";

const schema: Schema = K.schema({
    propA: K.number().$v(v => v.notEmpty()),
    propB: K.string()
        .$q(q => q.isValid("propA"))
        .$v(v => v.notEmpty())
        .default("bob"),
    propC: K.number().$q(q => q.isValid(["propA", "propB"])),
    propD: K.string().$v(v => v.notEmpty()),
    propE: K.object({
        propE1: K.string(),
    }),
});

describe("Form default initialization tests", () => {
    let form: Form;
    beforeEach(async () => {
        form = new Form({
            ...defaultConfig,
        });
    });

    it("should have correct id", async () => {
        expect(form.id).toBe("");
    });

    it("should have correct vars", async () => {
        expect(form.vars).toEqual({});
    });

    it("should have correct status after construction", async () => {
        expect(form.status).toBe(FormStatus.Init);
    });

    it("should have correct status after init", async () => {
        await form.init();
        expect(form.status).toBe(FormStatus.Ready);
    });

    it("should have a session id", async () => {
        expect(form.session);
    });

    it("should have a state", async () => {
        expect(form.state).toBeTypeOf("object");
    });

    it("should have env", async () => {
        expect(form.env).toBe(defaultConfig.env);
    });
});

describe("Form state isolation between instances", () => {
    it("should have isolated state", async () => {
        const form1 = await K.form({
            propA: K.string().default("value1"),
        });
        const form2 = await K.form({
            prop1: K.number().default(32),
        });

        expect(form1.state.data).toEqual({
            propA: "value1",
        });
        expect(form1.state.validations).toEqual({
            propA: [true, ""],
        });

        expect(form2.state.data).toEqual({
            prop1: 32,
        });
        expect(form2.state.validations).toEqual({
            prop1: [true, ""],
        });
    });
});

describe("Form childrenProps()", () => {
    let form: Form;
    beforeAll(async () => {
        form = await buildSchema(schema);
    });

    it("calling childrenProps() without parent", () => {
        expect(Object.keys(form.childrenProps("propE"))).toEqual([
            "propE.propE1",
        ]);
    });

    it("calling childrenProps() with parent", () => {
        expect(Object.keys(form.childrenProps("propE", true))).toEqual([
            "propE",
            "propE.propE1",
        ]);
    });
});

// todo: to refactor
test("FormTest_legacy", async () => {
    const form = await buildSchema(schema);

    form.events.onSelectorQualification("propB", async () => {
        // console.log(form.$d("propA"));
        if (form.$d("propA") === "FOO") {
            return [true, ""];
        }
        return [false, "CUSTOM_QUALIFICATION"];
    }, ["propA"]);

    expect(form.$v("propA")).toEqual([false, notEmptyValidator.err.IsEmpty]);
    expect(form.$q("propA")).toEqual([true, ""]);

    expect(form.$v("propB")).toEqual([
        false,
        QualificationError.SelectorDisqualified,
    ]);
    expect(form.$q("propB")).toEqual([
        false,
        isValidValidator.err.SelectorNotValid,
        { selectors: ["propA"] },
    ]);

    expect(form.$v("propC")).toEqual([
        false,
        QualificationError.SelectorDisqualified,
    ]);
    expect(form.$q("propC")).toEqual([
        false,
        isValidValidator.err.SelectorNotValid,
        { selectors: ["propA", "propB"] },
    ]);

    expect(form.$v("propD")).toEqual([false, notEmptyValidator.err.IsEmpty]);
    expect(form.$q("propD")).toEqual([true, ""]);

    await form.update("propA", 5);
    expect(form.$v("propA")).toEqual([true, ""]);
    expect(form.$q("propB")).toEqual([false, "CUSTOM_QUALIFICATION"]);
    expect(form.$q("propC")).toEqual([
        false,
        isValidValidator.err.SelectorNotValid,
        { selectors: ["propA", "propB"] },
    ]);

    await form.update("propA", "FOO");
    expect(form.$v("propB")).toEqual([true, ""]);
    expect(form.$q("propB")).toEqual([true, ""]);
    await form.update("propA", "FOOO");
    expect(form.$q("propB")).toEqual([false, "CUSTOM_QUALIFICATION"]);

    await form.update("propA", "FOO");
    expect(form.$q("propB")[0]).toBeTruthy();
    expect(form.$q("propC")[0]).toBeTruthy();

    await form.update("propB", "something");
    expect(form.$q("propC")[0]).toBeTruthy();
    await form.update("propA", null);
    expect(form.isQualified("propB")).toBeFalsy();
    expect(form.$d("propB")).toEqual(null);
    expect(form.$q("propC")[0]).toBeFalsy();

    await form.update("propA", "FOO");
    await form.update("propC", "whatever");
    await form.update("propD", "whatever");
});

describe("Form add/delete property", () => {
    let form: Form;
    beforeAll(async () => {
        form = await K.form({
            propA: K.string(),
            propB: K.string(),
        });
    });

    it("should add prop and trigger event", async () => {
        let selector = "";
        form.events.on(Events.PropertyAdded, ctx => {
            selector = ctx.selector;
        });

        expect(form.hasProp("propC")).toBeFalsy();
        expect(selector).toEqual("");

        await form.addProp(new Property("propC", K.string().def));

        expect(form.hasProp("propC")).toBeTruthy();
        expect(selector).toEqual("propC");
    });

    it("should delete prop and trigger event", async () => {
        let selector = "";
        form.events.on(Events.PropertyDeleted, ctx => {
            selector = ctx.selector;
        });

        expect(form.hasProp("propC")).toBeTruthy();
        expect(selector).toEqual("");

        await form.deleteProp("propC");

        expect(form.hasProp("propC")).toBeFalsy();
        expect(selector).toEqual("propC");
    });
});

describe("Form loadState event", () => {
    let form: Form;
    beforeAll(async () => {
        form = await K.form({
            propA: K.string(),
            propB: K.string(),
        });
    });

    it("should add prop and trigger event", async () => {
        let state: Partial<State> = {};
        form.events.on(Events.FormLoadState, ctx => {
            state = ctx.state;
        });
        expect(state).toEqual({});
    });
});

describe("Form errors()", () => {
    let form: Form;
    beforeAll(async () => {
        form = await buildSchema(schema);
    });

    it("should return only errors", async () => {
        const errors = form.errors();
        // default msgs are not that great, but they are meant to be translated or customized
        expect(errors).toEqual({
            $global: "_FORM_NOT_COMPLETE",
            propA: notEmptyValidator.err.IsEmpty,
            propB: QualificationError.SelectorDisqualified,
            propC: QualificationError.SelectorDisqualified,
            propD: notEmptyValidator.err.IsEmpty,
        });
    });

    it("should return no error when form pass", async () => {
        await form.updates({ propA: 4, propD: 4 });
        const errors = form.errors();
        expect(errors).toEqual({});
    });
});
