import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("UuidValidator", () => {
    let form: Form;

    it("test uuid regex - invalid by default", async () => {
        form = await K.form({
            propA: K.string("uuid"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
    });

    it("test uuid regex - valid uuid v4", async () => {
        form = await K.form({
            propA: K.string("uuid"),
        });
        await form.update("propA", "9b2f8f9e-9c2a-4f9e-8f9e-9c2a4f9e8f9e");
        expect(form.isPropValid("propA")).toBeTruthy();
    });

    it("test uuid regex - valid uuid v6", async () => {
        form = await K.form({
            propA: K.string("uuid"),
        });
        await form.update("propA", "1e9d1234-5678-6abc-89ab-0123456789ab");
        expect(form.isPropValid("propA")).toBeTruthy();
    });

    it("test uuid regex - valid uuid v7", async () => {
        form = await K.form({
            propA: K.string("uuid"),
        });
        await form.update("propA", "01890a5d-ac96-774b-8cce-b6a6e2b95b41");
        expect(form.isPropValid("propA")).toBeTruthy();
    });

    it("test uuid regex - nil uuid is valid", async () => {
        form = await K.form({
            propA: K.string("uuid"),
        });
        await form.update("propA", "00000000-0000-0000-0000-000000000000");
        expect(form.isPropValid("propA")).toBeTruthy();
    });

    it("test uuid regex - max uuid is valid", async () => {
        form = await K.form({
            propA: K.string("uuid"),
        });
        await form.update("propA", "ffffffff-ffff-ffff-ffff-ffffffffffff");
        expect(form.isPropValid("propA")).toBeTruthy();
    });

    it("test uuid regex - invalid format", async () => {
        form = await K.form({
            propA: K.string("uuid"),
        });
        await form.update("propA", "not-a-valid-uuid");
        expect(form.isPropValid("propA")).toBeFalsy();
    });
});

describe("UuidV4Validator", () => {
    let form: Form;

    it("test uuidV4 regex - invalid by default", async () => {
        form = await K.form({
            propA: K.string("uuidV4"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
    });

    it("test uuidV4 regex - valid uuid v4", async () => {
        form = await K.form({
            propA: K.string("uuidV4"),
        });
        await form.update("propA", "9b2f8f9e-9c2a-4f9e-8f9e-9c2a4f9e8f9e");
        expect(form.isPropValid("propA")).toBeTruthy();
    });

    it("test uuidV4 regex - rejects uuid v6", async () => {
        form = await K.form({
            propA: K.string("uuidV4"),
        });
        await form.update("propA", "1e9d1234-5678-6abc-89ab-0123456789ab");
        expect(form.isPropValid("propA")).toBeFalsy();
    });

    it("test uuidV4 regex - rejects uuid v7", async () => {
        form = await K.form({
            propA: K.string("uuidV4"),
        });
        await form.update("propA", "01890a5d-ac96-774b-8cce-b6a6e2b95b41");
        expect(form.isPropValid("propA")).toBeFalsy();
    });
});

describe("UuidV6Validator", () => {
    let form: Form;

    it("test uuidV6 regex - invalid by default", async () => {
        form = await K.form({
            propA: K.string("uuidV6"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
    });

    it("test uuidV6 regex - valid uuid v6", async () => {
        form = await K.form({
            propA: K.string("uuidV6"),
        });
        await form.update("propA", "1e9d1234-5678-6abc-89ab-0123456789ab");
        expect(form.isPropValid("propA")).toBeTruthy();
    });

    it("test uuidV6 regex - rejects uuid v4", async () => {
        form = await K.form({
            propA: K.string("uuidV6"),
        });
        await form.update("propA", "9b2f8f9e-9c2a-4f9e-8f9e-9c2a4f9e8f9e");
        expect(form.isPropValid("propA")).toBeFalsy();
    });

    it("test uuidV6 regex - rejects uuid v7", async () => {
        form = await K.form({
            propA: K.string("uuidV6"),
        });
        await form.update("propA", "01890a5d-ac96-774b-8cce-b6a6e2b95b41");
        expect(form.isPropValid("propA")).toBeFalsy();
    });
});

describe("UuidV7Validator", () => {
    let form: Form;

    it("test uuidV7 regex - invalid by default", async () => {
        form = await K.form({
            propA: K.string("uuidV7"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
    });

    it("test uuidV7 regex - valid uuid v7", async () => {
        form = await K.form({
            propA: K.string("uuidV7"),
        });
        await form.update("propA", "01890a5d-ac96-774b-8cce-b6a6e2b95b41");
        expect(form.isPropValid("propA")).toBeTruthy();
    });

    it("test uuidV7 regex - rejects uuid v4", async () => {
        form = await K.form({
            propA: K.string("uuidV7"),
        });
        await form.update("propA", "9b2f8f9e-9c2a-4f9e-8f9e-9c2a4f9e8f9e");
        expect(form.isPropValid("propA")).toBeFalsy();
    });

    it("test uuidV7 regex - rejects uuid v6", async () => {
        form = await K.form({
            propA: K.string("uuidV7"),
        });
        await form.update("propA", "1e9d1234-5678-6abc-89ab-0123456789ab");
        expect(form.isPropValid("propA")).toBeFalsy();
    });
});
