import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";

describe("Ipv4Validator", () => {
    let form: Form;
    it("test ipv4 regex", async () => {
        form = await K.form({
            propA: K.string("ipv4"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "127.0.0.1");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("Ipv6Validator", () => {
    let form: Form;
    it("test ipv6 regex", async () => {
        form = await K.form({
            propA: K.string("ipv6"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("Cidrv4Validator", () => {
    let form: Form;
    it("test cidrv4 regex", async () => {
        form = await K.form({
            propA: K.string("cidrv4"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "127.0.0.1");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "192.168.1.0/24");
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});

describe("Cidrv6Validator", () => {
    let form: Form;
    it("test cidrv6 regex", async () => {
        form = await K.form({
            propA: K.string("cidrv6"),
        });
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update("propA", "2001:0db8:85a3:0000:0000:8a2e:0370:7334");
        expect(form.isPropValid("propA")).toBeFalsy();
        await form.update(
            "propA",
            "2001:0db8:85a3:0000:0000:8a2e:0370:7334/64",
        );
        expect(form.isPropValid("propA")).toBeTruthy();
    });
});
