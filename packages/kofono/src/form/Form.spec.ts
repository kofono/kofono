import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { buildSchema } from "../builder/helpers";
import { K } from "../builder/K";
import { Property } from "../property/Property";
import type { Schema } from "../schema/Schema";
import { notEmptyValidator } from "../validator/empty/NotEmptyValidator";
import { QualificationError } from "../validator/types";
import { defaultConfig } from "./defaults";
import { Events } from "./events/types";
import { Form } from "./Form";
import { FormStatus, type State } from "./types";

const schema = K.schema({
    aNumber: K.number("notEmpty"),
    bString: K.string("notEmpty")
        .qualifications({ isValid: "aNumber" })
        .default("bob"),
    cNumber: K.number().qualifications({ isValid: ["aNumber", "bString"] }),
    dString: K.string("notEmpty"),
    eObject: K.object({
        aString: K.string(),
    }),
    fBoolean: K.boolean(),
}) satisfies Schema;

describe("Empty form default initialization tests", () => {
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

    it("should have correct status after init()", async () => {
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
        form = await K.form(schema);
    });

    it("calling childrenProps() without parent", () => {
        expect(Object.keys(form.childrenProps("eObject"))).toEqual([
            "eObject.aString",
        ]);
    });

    it("calling childrenProps() with parent", () => {
        expect(Object.keys(form.childrenProps("eObject", true))).toEqual([
            "eObject",
            "eObject.aString",
        ]);
    });
});

describe("Form addProp()/deleteProp() property", () => {
    let form: Form;
    beforeAll(async () => {
        form = await K.form({
            aString: K.string(),
            bString: K.string(),
        });
    });

    it("should add prop and trigger event", async () => {
        let selector = "";
        form.events.on(Events.PropertyAdded, ctx => {
            selector = ctx.selector;
        });

        expect(form.hasProp("cString")).toBeFalsy();
        expect(selector).toEqual("");

        await form.addProp(new Property("cString", K.string().def));

        expect(form.hasProp("cString")).toBeTruthy();
        expect(selector).toEqual("cString");
    });

    it("should delete prop and trigger event", async () => {
        let selector = "";
        form.events.on(Events.PropertyDeleted, ctx => {
            selector = ctx.selector;
        });

        expect(form.hasProp("cString")).toBeTruthy();
        expect(selector).toEqual("");

        await form.deleteProp("cString");

        expect(form.hasProp("cString")).toBeFalsy();
        expect(selector).toEqual("cString");
    });
});

describe("Form loadState() and Events.FormLoadState", () => {
    let form: Form;
    beforeAll(async () => {
        form = await K.form({
            propA: K.string(),
            propB: K.string(),
        });
    });

    it("should trigger the event when loadState()", async () => {
        let state: Partial<State> = {};
        form.events.on(Events.FormLoadState, ctx => {
            state = ctx.state;
        });
        await form.loadState({
            data: {
                propA: "FOO",
                propB: "BAR",
            },
        });
        expect(state.data).toEqual({
            propA: "FOO",
            propB: "BAR",
        });
    });
});

describe("Form update() and updates()", () => {
    let form: Form;
    beforeEach(async () => {
        form = await K.form(schema);
    });

    it("simple normal update should work", async () => {
        const result = await form.update("aNumber", 0);
        expect(result.ok).toBeTruthy();
    });

    it("wrong type should not work", async () => {
        const result = await form.update("aNumber", "wrongtype");
        expect(result.ok).toBeFalsy();
        if (!result.ok) {
            expect(result.error).toEqual(
                "Invalid data type for selector: aNumber",
            );
        }
    });

    it("unknown selector type should not work", async () => {
        const result = await form.update("unknownSelector", "foo");
        expect(result.ok).toBeFalsy();
        if (!result.ok) {
            expect(result.error).toEqual("Selector not found: unknownSelector");
        }
    });

    it("updates() should return a correct Result[]", async () => {
        let result = await form.updates({
            aNumber: "foo",
            bString: "bar",
            unknownSelector: "foo",
        });

        expect(result).toEqual([
            { ok: false, error: "Invalid data type for selector: aNumber" },
            { ok: false, error: "Selector not qualified: bString" },
            { ok: false, error: "Selector not found: unknownSelector" },
        ]);

        result = await form.updates({
            aNumber: 1,
            bString: "bar",
        });

        expect(result).toEqual([{ ok: true }, { ok: true }]);
        expect(form.state.data.aNumber).toEqual(1);
        expect(form.state.data.bString).toEqual("bar");
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
            aNumber: notEmptyValidator.err.IsEmpty,
            bString: QualificationError.SelectorDisqualified,
            cNumber: QualificationError.SelectorDisqualified,
            dString: notEmptyValidator.err.IsEmpty,
        });
    });

    it("should return no error when form pass", async () => {
        await form.updates({ aNumber: 4, dString: "test" });
        const errors = form.errors();
        expect(errors).toEqual({});
    });
});
