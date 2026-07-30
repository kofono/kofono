import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("GuidValidator", () => {
    let form: Form;
    it("test guid regex", async () => {
        form = await K.form({
            a: K.string("guid"),
        });
        expect(form.isPropValid("a")).toBeFalsy();
        await form.update("a", "123e4567-e89b-12d3-a456-426614174000");
        expect(form.isPropValid("a")).toBeTruthy();
    });
});

describe("CuidValidator", () => {
    let form: Form;
    it("test cuid regex", async () => {
        form = await K.form({
            propA: K.string("cuid"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "cabcdef");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("Cuid2Validator", () => {
    let form: Form;
    it("test cuid2 regex", async () => {
        form = await K.form({
            propA: K.string("cuid2"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "abc123xyz");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("UlidValidator", () => {
    let form: Form;
    it("test ulid regex", async () => {
        form = await K.form({
            propA: K.string("ulid"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "01ARZ3NDEKTSV4RRFFQ69G5FAV");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("XidValidator", () => {
    let form: Form;
    it("test xid regex", async () => {
        form = await K.form({
            propA: K.string("xid"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "0f8f2d3e4a5b6c7d8e9a");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("KsuidValidator", () => {
    let form: Form;
    it("test ksuid regex", async () => {
        form = await K.form({
            propA: K.string("ksuid"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "0o5Fs0EELR0fUjHjbCnEtdUwQe3");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("NanoidValidator", () => {
    let form: Form;
    it("test nanoid regex", async () => {
        form = await K.form({
            propA: K.string("nanoid"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "V1StGXR8_Z5jdHi6B-myT");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});
