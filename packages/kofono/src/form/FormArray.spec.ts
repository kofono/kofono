import { beforeAll, describe, expect, it } from "vitest";
import { buildSchema } from "../builder/helpers";
import { K } from "../builder/K";
import type { SchemaArrayProperty } from "../schema/Schema";
import { notEmptyValidator } from "../validator/empty/NotEmptyValidator";
import { isValidValidator } from "../validator/isValid/IsValidValidator";
import { Events } from "./events/types";
import type { Form } from "./Form";

const schema = K.schema({
    propA: K.array(
        K.object({
            A: K.string().$v(v => v.notEmpty()),
            B: K.number().default(23),
            C: K.boolean().$q(q => q.isValid(".A")),
        }),
    ),
});

describe("FormArray expand", () => {
    let form: Form;
    beforeAll(async () => {
        form = await buildSchema(schema);
    });

    it("should propA of type ArrayProperty have correct item", () => {
        expect(form.prop("propA").get("items")).toEqual(
            (schema.__.propA as SchemaArrayProperty).items,
        );
    });

    it("should have the same 0 items at start", () => {
        expect(form.state.data.propA.length).toEqual(0);
    });

    it("should have 1 item after expand once", async () => {
        await form.array.expand("propA");
        expect(form.state.data.propA).toHaveLength(1);
        expect(form.state.data).toEqual({
            propA: [
                {
                    A: "",
                    B: 23,
                    C: null,
                },
            ],
        });
    });

    it("should have correct events after expand once", () => {
        expect(form.events.selectorsDependencies).toEqual({
            "propA.0.A": ["propA.0.C"],
        });

        expect(Object.keys(form.events.selectorsEvents)).toEqual([
            "propA.0.A",
            "propA.0.C",
        ]);
    });

    it("should have correct validation and qualification after expand once", async () => {
        expect(form.$v("propA.0.A")).toEqual([
            false,
            notEmptyValidator.err.IsEmpty,
        ]);
        expect(form.$q("propA.0.C")).toEqual([
            false,
            isValidValidator.err.SelectorNotValid,
            {
                selectors: ["propA.0.A"],
            },
        ]);

        await form.update("propA.0.A", "foo");
        expect(form.$v("propA.0.A")).toEqual([true, ""]);
        expect(form.$q("propA.0.C")).toEqual([true, ""]);
    });

    it("should have a correct list of selectors after expand once", () => {
        expect(form.propsKeys()).toEqual([
            "propA",
            "propA.0",
            "propA.0.A",
            "propA.0.B",
            "propA.0.C",
        ]);
    });

    it("should have 3 total items after expanding twice", async () => {
        await form.array.expand("propA", 2);
        expect(form.state.data.propA).toHaveLength(3);
    });

    it("should have correct events after expending twice", () => {
        expect(form.events.selectorsDependencies).toEqual({
            "propA.0.A": ["propA.0.C"],
            "propA.1.A": ["propA.1.C"],
            "propA.2.A": ["propA.2.C"],
        });

        expect(Object.keys(form.events.selectorsEvents)).toEqual([
            "propA.0.A",
            "propA.0.C",
            "propA.1.A",
            "propA.1.C",
            "propA.2.A",
            "propA.2.C",
        ]);
    });

    it("should have correct data after updates", async () => {
        await form.updates({
            "propA.1.A": "bar",
            "propA.2.A": "",
            "propA.1.B": 42,
            "propA.2.B": 15,
            "propA.1.C": true,
            "propA.2.C": false,
        });
        expect(form.state.data).toEqual({
            propA: [
                {
                    A: "foo",
                    B: 23,
                    C: false,
                },
                {
                    A: "bar",
                    B: 42,
                    C: true,
                },
                {
                    A: "",
                    B: 15,
                    C: false,
                },
            ],
        });
    });

    it("third item should have correct validation and qualification", () => {
        expect(form.$v("propA.2.A")).toEqual([
            false,
            notEmptyValidator.err.IsEmpty,
        ]);
        expect(form.$q("propA.2.C")).toEqual([
            false,
            isValidValidator.err.SelectorNotValid,
            {
                selectors: ["propA.2.A"],
            },
        ]);
    });
});

describe("FormArray slice in the middle", () => {
    let form: Form;
    beforeAll(async () => {
        form = await buildSchema(schema);
        await form.array.expand("propA", 3);
        await form.updates({
            // 0
            "propA.0.A": null,
            "propA.0.B": 23,
            "propA.0.C": null,
            // 1
            "propA.1.A": "bar",
            "propA.1.B": 42,
            "propA.1.C": true,
            // 2
            "propA.2.A": "bob",
            "propA.2.B": 15,
            "propA.2.C": false,
        });
        await form.array.slice("propA", 1);
    });

    it("should have a correct list of selectors after slice item index 1", () => {
        expect(form.propsKeys()).toEqual([
            "propA",
            "propA.0",
            "propA.0.A",
            "propA.0.B",
            "propA.0.C",
            "propA.1",
            "propA.1.A",
            "propA.1.B",
            "propA.1.C",
        ]);
    });

    it("should have correct data after slice item index 1", () => {
        expect(form.state.data.propA).toHaveLength(2);
        expect(form.state.data).toEqual({
            propA: [
                {
                    A: null,
                    B: 23,
                    C: null,
                },
                {
                    A: "bob",
                    B: 15,
                    C: false,
                },
            ],
        });
    });

    it("should have correct events after slice item index 1", () => {
        expect(form.events.selectorsDependencies).toEqual({
            "propA.0.A": ["propA.0.C"],
            "propA.1.A": ["propA.1.C"],
        });

        expect(Object.keys(form.events.selectorsEvents)).toEqual([
            "propA.0.A",
            "propA.0.C",
            "propA.1.A",
            "propA.1.C",
        ]);
    });
});

describe("FormArray slice at the end", () => {
    let form: Form;
    beforeAll(async () => {
        form = await buildSchema(schema);
        await form.array.expand("propA", 3);
        await form.updates({
            // 0
            "propA.0.A": null,
            "propA.0.B": 23,
            "propA.0.C": null,
            // 1
            "propA.1.A": "bar",
            "propA.1.B": 42,
            "propA.1.C": true,
            // 2
            "propA.2.A": "bob",
            "propA.2.B": 15,
            "propA.2.C": false,
        });
        await form.array.slice("propA", 2);
    });

    it("should have a correct list of selectors after slice last item", () => {
        expect(form.propsKeys()).toEqual([
            "propA",
            "propA.0",
            "propA.0.A",
            "propA.0.B",
            "propA.0.C",
            "propA.1",
            "propA.1.A",
            "propA.1.B",
            "propA.1.C",
        ]);
    });

    it("should have correct data after slice last item", () => {
        expect(form.state.data.propA).toHaveLength(2);
        expect(form.state.data).toEqual({
            propA: [
                {
                    A: null,
                    B: 23,
                    C: null,
                },
                {
                    A: "bar",
                    B: 42,
                    C: true,
                },
            ],
        });
    });

    it("should have correct events after slice last item", () => {
        expect(form.events.selectorsDependencies).toEqual({
            "propA.0.A": ["propA.0.C"],
            "propA.1.A": ["propA.1.C"],
        });

        expect(Object.keys(form.events.selectorsEvents)).toEqual([
            "propA.0.A",
            "propA.0.C",
            "propA.1.A",
            "propA.1.C",
        ]);
    });
});

describe("FormArray propertyAdded/PropertyRemoved  event", () => {
    it("should be called when expanding an array", async () => {
        const form = await K.form({
            propA: K.array(K.string()),
            propB: K.array(K.object({ A: K.string(), B: K.number() })),
        });
        let arraySelector: string = "";
        let qtyAdded: number = 0;
        form.events.on(Events.ArrayPropertyExpanded, ctx => {
            arraySelector = ctx.selector;
            qtyAdded = ctx.qty;
        });

        await form.array.expand("propA", 2);
        expect(arraySelector).toEqual(arraySelector);
        expect(qtyAdded).toEqual(2);
    });

    it("should be called when slicing an array", async () => {
        const form = await K.form({
            propA: K.array(K.string()),
            propB: K.array(K.object({ A: K.string(), B: K.number() })),
        });
        let arraySelector: string = "";
        let index: number = 0;
        form.events.on(Events.ArrayPropertySliced, ctx => {
            arraySelector = ctx.selector;
            index = ctx.index;
        });

        await form.array.expand("propA", 2);
        await form.array.slice("propA", 1);

        expect(arraySelector).toEqual(arraySelector);
        expect(index).toEqual(1);
    });
});
