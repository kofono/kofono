import { beforeEach, describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";
import { ScoringExtension, scoring } from "./ScoringExtension";

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
            // max: 3+2-2+0
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

    it("should update extension metadata in form state after property update", async () => {
        await form.update("a", "yeah");
        const ext = form.extensions.getByIndex(0);
        expect(ext?.metaData).toEqual({
            max: 3,
            selectors: {
                a: 3,
                b: 0,
                c: 0,
                d: 0,
            },
            total: 3,
        });
        expect(form.state.meta.extensions).toEqual([
            {
                data: ext?.metaData,
                name: "scoring",
                id: "myScore",
            },
        ]);

        await form.update("b", "foo");
        expect(form.state.meta.extensions[0].data).toEqual({
            max: 5,
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
            max: 3,
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
            max: 3,
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
