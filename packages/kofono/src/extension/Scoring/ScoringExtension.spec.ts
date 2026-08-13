import { beforeEach, describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";
import { scoring, ScoringExtension } from "./ScoringExtension";

describe("ScoringExtension schema", () => {
    it("should create correct schema", async () => {
        const schema = K.schema({
            $extensions: [
                scoring({
                    id: "myScore",
                    defaultScoreValue: 0,
                }),
            ],
        });
        expect(schema.$extensions).toEqual([
            {
                scoring: {
                    id: "myScore",
                    defaultScoreValue: 0,
                },
            },
        ]);
    });
});

describe("ScoringExtension instance", () => {
    let form: Form;
    beforeEach(async () => {
        form = await K.form({
            $extensions: [
                scoring({
                    id: "myScore",
                    defaultScoreValue: 0,
                }),
            ],
            a: K.string().set("score", 3),
            b: K.string("notEmpty").set("score", 2),
            c: K.string("notEmpty").set("score", -2),
            d: K.string("notEmpty"),
        });
    });

    it("should load extension correctly", async () => {
        expect(form.extensions.extensions).toHaveLength(1);
        expect(form.extensions.extensions[0].metaName).toEqual("scoring");
    });

    it("should have extension metadata in form state", () => {
        const ext = form.extensions.getByIndex(0);
        expect(ext).toBeInstanceOf(ScoringExtension);
        expect(form.state.meta.extensions).toEqual([
            {
                data: ext?.metaData,
                name: "scoring",
                id: "myScore",
            },
        ]);
    });

    it("should prepare meta scoring on from ready", async () => {
        expect(form.state.meta.extensions).toEqual([
            {
                data: {
                    selectors: {
                        a: 3,
                        b: 0,
                        c: 0,
                        d: 0,
                    },
                    total: 3,
                },
                name: "scoring",
                id: "myScore",
            },
        ]);
    });

    it("should update extension metadata in form state after property update", async () => {
        const ext = form.extensions.getByIndex(0);
        expect(form.state.meta.extensions).toEqual([
            {
                data: ext?.metaData,
                name: "scoring",
                id: "myScore",
            },
        ]);

        await form.update("b", "foo");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: {
                a: 3,
                b: 2,
                c: 0,
                d: 0,
            },
            total: 5,
        });

        await form.update("c", "bar");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: {
                a: 3,
                b: 2,
                c: -2,
                d: 0,
            },
            total: 3,
        });

        await form.update("d", "");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: {
                a: 3,
                b: 2,
                c: -2,
                d: 0,
            },
            total: 3,
        });
    });
});

describe("ScoringExtension and enum property", () => {
    it("should calculate scoring by using enum item score of property", async () => {
        const form = await K.form({
            $extensions: ["scoring"],
            a: K.string().enum([
                { value: "foo", score: 1 },
                { value: "bar", score: 2 },
            ]),
        });

        await form.update("a", "foo");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 1 },
            total: 1,
        });
        await form.update("a", "bar");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 2 },
            total: 2,
        });
    });

    it("should calculate scoring by using property default score as fallback when enum item dont exists or dont have score", async () => {
        const form = await K.form({
            $extensions: ["scoring"],
            a: K.string("notEmpty")
                .set("score", 2) // act as default scoring for enum with no score
                .enum([{ value: "foo" }, { value: "bar", score: 3 }]),
        });

        await form.update("a", "foo");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 2 },
            total: 2,
        });

        await form.update("a", "bar");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 3 },
            total: 3,
        });

        // "unknown" is not defined in enum, but prop value is valid, so it should fallback to default score
        await form.update("a", "unknown");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 2 },
            total: 2,
        });
    });

    it("should calculate scoring correctly based on validations after updating property", async () => {
        const form = await K.form({
            $extensions: ["scoring"],
            a: K.string("required")
                .set("score", 4)
                .enum([{ value: "foo", score: 2 }]),
        });

        await form.update("a", "foo");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 2 },
            total: 2,
        });

        // since bar is not in the enum, and prop value is invalid (because 'required'), the scoring should be 0
        await form.update("a", "bar");

        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 0 },
            total: 0,
        });
    });
});

describe("ScoringExtension multiple instance", () => {
    it("should 3 instance  of ScoringExtension work independently", async () => {
        const form = await K.form({
            $extensions: [
                {
                    scoring: {},
                },
            ],
            a: K.string().enum([
                { value: "foo", score: 1 },
                { value: "bar", score: 2 },
            ]),
        });

        await form.update("a", "foo");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 1 },
            total: 1,
        });
        await form.update("a", "bar");
        expect(form.state.meta.extensions[0].data).toEqual({
            selectors: { a: 2 },
            total: 2,
        });
    });
});
