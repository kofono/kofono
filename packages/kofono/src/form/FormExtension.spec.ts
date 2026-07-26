import { describe, expect, it } from "vitest";
import { K } from "../../src";
import { updateCounter } from "../extension/UpdateCounter/UpdateCounterExtension";

describe("FormExtension tests", () => {
    it("should getByIndex() work correctly", async () => {
        const form = await K.form({
            $extensions: [updateCounter("id1"), updateCounter("id2")],
        });

        const ext1 = form.extensions.getByIndex(0);
        expect(ext1).toBeDefined();
        expect(ext1?.metaId).toBe("id1");

        const ext2 = form.extensions.getByIndex(1);
        expect(ext2).toBeDefined();
        expect(ext2?.metaId).toBe("id2");

        const ext3 = form.extensions.getByIndex(2);
        expect(ext3).toBeUndefined();
    });

    it("should getById() work correctly", async () => {
        const form = await K.form({
            $extensions: [updateCounter("id1"), updateCounter("id2")],
        });

        const ext1 = form.extensions.getById("id1");
        expect(ext1).toBeDefined();
        expect(ext1?.metaId).toBe("id1");

        const ext2 = form.extensions.getById("id2");
        expect(ext2).toBeDefined();
        expect(ext2?.metaId).toBe("id2");

        const ext3 = form.extensions.getById("id3");
        expect(ext3).toBeUndefined();
    });

    it("should get length work correctly", async () => {
        const form = await K.form({
            $extensions: [updateCounter("id1"), updateCounter("id2")],
        });

        expect(form.extensions.length).toBe(2);
    });

    it("should getMetaIndex() with ids work correctly when starting with a partial meta state", async () => {
        const form = await K.form(
            {
                $extensions: [
                    updateCounter("id15"),
                    updateCounter("id50"),
                    updateCounter("id100"),

                    // valid new case, since it's new (no previous state), it should be at the end
                    updateCounter("id3000"),
                ],
                propA: K.string(),
            },
            {
                state: {
                    meta: {
                        hasBeenUpdated: [],
                        extensions: [
                            {
                                id: "fake-state-that-should-be-ignored",
                                name: "updateCounter",
                                data: -1,
                            },
                            {
                                id: "id100",
                                name: "updateCounter",
                                data: 100,
                            },
                            {
                                id: "id50",
                                name: "updateCounter",
                                data: 50,
                            },
                            {
                                id: "id15",
                                name: "updateCounter",
                                data: 15,
                            },
                        ],
                    },
                },
            },
        );

        expect(form.extensions.getById("id100")?.metaIndex).toBe(1);
        expect(form.extensions.getById("id50")?.metaIndex).toBe(2);
        expect(form.extensions.getById("id15")?.metaIndex).toBe(3);
        expect(form.extensions.getById("id3000")?.metaIndex).toBe(4);

        // edge case here, since we introduced fake meta extension in state, it should be ignored
        expect(
            form.extensions.getById("fake-state-that-should-be-ignored")
                ?.metaIndex,
        ).toBeUndefined();

        // but todo: meta is still polluted with the fake state, we should fix this
        expect(form.state.meta.extensions[0].id).toBe(
            "fake-state-that-should-be-ignored",
        );
    });

    it("should getMetaIndex() with ids work correctly when form with partial state meta extensions", async () => {
        const form = await K.form(
            {
                $extensions: [
                    updateCounter("id100"),
                    // valid new case, since it's new (no previous state), it should be at the end
                    updateCounter("id3000"),
                ],
                propA: K.string(),
            },
            {
                state: {
                    meta: {
                        hasBeenUpdated: [],
                        extensions: [
                            {
                                id: "id100",
                                name: "updateCounter",
                                data: 100,
                            },
                        ],
                    },
                },
            },
        );

        expect(form.extensions.getById("id100")?.metaIndex).toBe(0);
        expect(form.extensions.getById("id3000")?.metaIndex).toBe(1);
    });

    it("should getMetaIndex() with names and ids work correctly when form with partial extensions meta state", async () => {
        const form = await K.form(
            {
                $extensions: [
                    updateCounter(),
                    // valid new case, since it's new (no previous state), it should be at the end
                    updateCounter("id3000"),
                ],
                propA: K.string(),
            },
            {
                state: {
                    meta: {
                        hasBeenUpdated: [],
                        extensions: [
                            {
                                id: "id3000",
                                name: "updateCounter",
                                data: 3000,
                            },
                        ],
                    },
                },
            },
        );

        expect(form.extensions.getById("id3000")?.metaIndex).toBe(0);
        expect(form.extensions.getByIndex(1)?.metaIndex).toBe(1);

        expect(form.state.meta.extensions.length).toBe(2);
    });

    it("should getMetaIndex() with names and ids work correctly when form with complete extensions meta state", async () => {
        const form = await K.form(
            {
                $extensions: [updateCounter(), updateCounter("id3000")],
                propA: K.string(),
            },
            {
                state: {
                    meta: {
                        hasBeenUpdated: [],
                        extensions: [
                            {
                                name: "updateCounter",
                                data: 1111,
                            },
                            {
                                id: "id3000",
                                name: "updateCounter",
                                data: 3000,
                            },
                        ],
                    },
                },
            },
        );

        expect(form.extensions.getById("id3000")?.metaIndex).toBe(1);
        expect(form.extensions.getByIndex(0)?.metaId).toBe(undefined);
        expect(form.extensions.getByIndex(0)?.metaName).toBe("updateCounter");

        expect(form.state.meta.extensions.length).toBe(2);
    });
});
