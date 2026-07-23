import { beforeEach, describe, expect, it } from "vitest";
import { buildSchema } from "../builder/helpers";
import { K } from "../builder/K";
import type { Form } from "./Form";

describe("FormProperty", () => {
    let form: Form;
    beforeEach(async () => {
        const schema = K.schema({
            propA: K.string().$v(v => v.notEmpty()),
            propB: K.string()
                .$v(v => v.notEmpty())
                .default("test"),
            propC: K.object({
                c1: K.string(),
                c2: K.string(),
                c3: K.string().$v(v => v.notEmpty()),
            }).$q(q => q.isValid("propA")),
            propD: K.null(),
            propF: K.string(),
        });

        form = await buildSchema(schema);
    });

    describe("for method parentsQualified()", () => {
        it("given a root property, it should return true (no parent)", () => {
            const prop = form.prop("propA");
            expect(prop.parentsQualified()).toBeTruthy();
        });
        it("given a disqualified root property, it should return true (no parent)", () => {
            const prop = form.prop("propB");
            expect(prop.parentsQualified()).toBeTruthy();
        });
        it("given property with disqualified parent, it should return false", async () => {
            const prop = form.prop("propC.c1");
            expect(prop.parentsQualified()).toBeFalsy();
            await form.update("propA", "foo");
            expect(prop.parentsQualified()).toBeTruthy();
        });
    });

    describe("for method valueOrDefault()", () => {
        it("given string propA, should return null", () => {
            expect(form.prop("propA").valueOrDefault(null)).toBe("");
        });
        it("given string propB, should return default value 'test'", () => {
            expect(form.prop("propB").valueOrDefault(null)).toBe("test");
        });
        it("given string propC, should return the object", () => {
            expect(form.prop("propC").valueOrDefault(null)).toEqual({
                c1: null,
                c2: null,
                c3: null,
            });
        });
        it("given null propD, should return null", () => {
            expect(form.prop("propD").valueOrDefault(null)).toBeNull();
        });
    });

    describe("for method isRequired() and isOptional()", () => {
        it("should return true if property has validation(s)", async () => {
            expect(form.prop("propA").isRequired()).toBeTruthy();
            expect(form.prop("propA").isOptional()).toBeFalsy();

            expect(form.prop("propB").isRequired()).toBeTruthy();
            expect(form.prop("propB").isOptional()).toBeFalsy();

            expect(form.prop("propC.c1").isRequired()).toBeFalsy();
            expect(form.prop("propC.c1").isOptional()).toBeTruthy();

            expect(form.prop("propC.c2").isRequired()).toBeFalsy();
            expect(form.prop("propC.c2").isOptional()).toBeTruthy();

            expect(form.prop("propC.c3").isRequired()).toBeTruthy();
            expect(form.prop("propC.c3").isOptional()).toBeFalsy();

            expect(form.prop("propD").isRequired()).toBeFalsy();
            expect(form.prop("propD").isOptional()).toBeTruthy();

            expect(form.prop("propF").isRequired()).toBeFalsy();
            expect(form.prop("propF").isOptional()).toBeTruthy();
        });
    });
});
