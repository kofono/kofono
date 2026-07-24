import { beforeEach, describe, expect, it } from "vitest";
import {
    type Form,
    isValid,
    isValidValidator,
    K,
    notEmptyValidator,
    QualificationError,
} from "../../src";

const isTrue = [true, ""];
const errSelectorDisqualified = [
    false,
    QualificationError.SelectorDisqualified,
];
const errParentDisqualified = [false, QualificationError.ParentDisqualified];
const errIsEmpty = [false, notEmptyValidator.err.IsEmpty];

describe("Testing qualifications with nested objects", () => {
    let form: Form;
    // each test is a new form
    beforeEach(async () => {
        form = await K.form({
            propA: K.string("notEmpty"),

            propB: K.object({
                one: K.string("notEmpty"),
                two: K.string("notEmpty"),
            }).qualifications(isValid("propA")),

            propC: K.object({
                one: K.string("notEmpty"),
                two: K.object({
                    other: K.string("notEmpty"),
                }).qualifications(isValid("propC.one")),
            }).qualifications(isValid("propB.one")),
        });
    });

    describe("on start", () => {
        it("propB should be disqualified because propA is not valid", async () => {
            expect(form.$q("propB")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propA"] },
            ]);
            expect(form.$v("propB")).toEqual(errSelectorDisqualified);
        });

        it("propB children value should be null", async () => {
            expect(form.$d("propB")).toEqual({
                one: null,
                two: null,
            });
        });

        it("propB children should be disqualified because propB is disqualified", async () => {
            expect(form.$q("propB.one")).toEqual(errParentDisqualified);
            expect(form.$v("propB.one")).toEqual(errSelectorDisqualified);

            expect(form.$q("propB.two")).toEqual(errParentDisqualified);
            expect(form.$v("propB.two")).toEqual(errSelectorDisqualified);
        });

        it("propC should be disqualified because propB.one is disqualified", async () => {
            expect(form.$q("propC")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propB.one"] },
            ]);
            expect(form.$v("propC")).toEqual(errSelectorDisqualified);
        });

        it("propC children should be disqualified because propB.one is disqualified", async () => {
            expect(form.$q("propC.one")).toEqual(errParentDisqualified);
            expect(form.$v("propC.one")).toEqual(errSelectorDisqualified);

            expect(form.$q("propC.two")).toEqual(errParentDisqualified);
            expect(form.$v("propC.two")).toEqual(errSelectorDisqualified);

            expect(form.$q("propC.two.other")).toEqual(errParentDisqualified);
            expect(form.$v("propC.two.other")).toEqual(errSelectorDisqualified);
        });

        it("propC children value should be null", async () => {
            expect(form.$d("propC")).toEqual({
                one: null,
                two: {
                    other: null,
                },
            });
        });

        it("stats should be correct", async () => {
            expect(form.state.stats).toEqual({
                invalid: 1,
                leaf: 5,
                node: 3,
                progression: 0,
                qualified: 1,
                valid: 0,
            });
        });
    });

    describe("after updating propA", () => {
        beforeEach(async () => {
            await form.update("propA", "valid");
        });
        it("propB should be qualified because propA is valid", async () => {
            expect(form.$q("propB")).toEqual(isTrue);
            expect(form.$v("propB")).toEqual(isTrue);
        });

        it("propB children should be qualified because propA is valid", async () => {
            expect(form.$q("propB.one")).toEqual(isTrue);
            expect(form.$v("propB.one")).toEqual(errIsEmpty);
        });

        it("propB children value should be not null", async () => {
            expect(form.$d("propB")).toEqual({
                one: "",
                two: "",
            });
        });

        it("propC should still be disqualified because propB.one is not valid", async () => {
            expect(form.$q("propC.one")).toEqual(errParentDisqualified);
            expect(form.$v("propC.one")).toEqual(errSelectorDisqualified);

            expect(form.$q("propC.two")).toEqual(errParentDisqualified);
            expect(form.$v("propC.two")).toEqual(errSelectorDisqualified);

            expect(form.$q("propC.two.other")).toEqual(errParentDisqualified);
            expect(form.$v("propC.two.other")).toEqual(errSelectorDisqualified);
        });

        it("stats should be correct", async () => {
            expect(form.state.stats).toEqual({
                invalid: 2,
                leaf: 5,
                node: 3,
                progression: 33,
                qualified: 3,
                valid: 1,
            });
        });
    });

    describe("after updating propB children", () => {
        beforeEach(async () => {
            await form.updates({
                propA: "text",
                "propB.one": "text",
                "propB.two": "text",
            });
        });

        it("propC should be qualified because propB.one is valid", async () => {
            expect(form.$q("propC")).toEqual(isTrue);
            expect(form.$v("propC")).toEqual(isTrue);
        });

        it("propC qualified children value should be not null", async () => {
            expect(form.$d("propC")).toEqual({
                one: "",
                two: {
                    other: null,
                },
            });
        });

        it("propC children should be qualified because propB.one is valid", async () => {
            expect(form.$q("propC.one")).toEqual(isTrue);
            expect(form.$v("propC.one")).toEqual(errIsEmpty);

            expect(form.$q("propC.two")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propC.one"] },
            ]);
            expect(form.$v("propC.two")).toEqual(errSelectorDisqualified);

            expect(form.$q("propC.two.other")).toEqual(errParentDisqualified);
            expect(form.$v("propC.two.other")).toEqual(errSelectorDisqualified);
        });

        it("stats should be correct", async () => {
            expect(form.state.stats).toEqual({
                invalid: 1,
                leaf: 5,
                node: 3,
                progression: 75,
                qualified: 4,
                valid: 3,
            });
        });
    });

    describe("after updating propC.one", () => {
        beforeEach(async () => {
            await form.updates({
                propA: "text",
                "propB.one": "text",
                "propB.two": "text",
                "propC.one": "text",
            });
        });

        it("propC.two children should be qualified because propB.one is valid", async () => {
            expect(form.$q("propC.one")).toEqual(isTrue);
            expect(form.$v("propC.one")).toEqual(isTrue);

            expect(form.$q("propC.two")).toEqual(isTrue);
            expect(form.$v("propC.two")).toEqual(isTrue);

            expect(form.$q("propC.two.other")).toEqual(isTrue);
            expect(form.$v("propC.two.other")).toEqual(errIsEmpty);
        });

        it("propC.two children should be not qualified because propB.one is updated to invalid value", async () => {
            await form.update("propC.one", "");
            expect(form.$q("propC.two")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propC.one"] },
            ]);
            expect(form.$v("propC.two")).toEqual(errSelectorDisqualified);
            expect(form.$q("propC.two.other")).toEqual(errParentDisqualified);
            expect(form.$v("propC.two.other")).toEqual(errSelectorDisqualified);
        });
    });
});

describe("Testing qualifications value resetting", () => {
    let form: Form;
    // each test is a new form
    beforeEach(async () => {
        form = await K.form({
            propA: K.string("notEmpty"),

            propB: K.object({
                one: K.string("notEmpty").default("ONE_DEFAULT"),
                two: K.object({
                    other: K.string("notEmpty").default("TWO_OTHER"),
                }).qualifications(isValid("propB.one")),
            }).qualifications(isValid("propA")),
        });
    });

    describe("on start", () => {
        it("propB children value should be null", async () => {
            expect(form.state.data.propB).toEqual({
                one: null,
                two: {
                    other: null,
                },
            });
        });
    });
});
