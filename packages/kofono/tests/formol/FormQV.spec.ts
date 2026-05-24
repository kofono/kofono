import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
    buildSchema,
    type Form,
    isValidValidator,
    notEmptyValidator,
    QualificationError,
} from "../../src";

const Err = {
    ...QualificationError,
    // ...NotEmptyValidatorError,
};

describe("Testing qualifications / disqualifications", () => {
    let form: Form;
    beforeAll(async () => {
        form = await buildSchema({
            __: {
                propA: {
                    type: "string",
                    $v: ["notEmpty"],
                },
                propB: {
                    type: "number",
                    $q: [
                        {
                            isValid: "propA",
                        },
                    ],
                    $v: ["notEmpty"],
                },
            },
        });
    });

    describe("after building", () => {
        it("should have correct stats", () => {
            expect(form.state.stats).toEqual({
                invalid: 1,
                leaf: 2,
                node: 0,
                progression: 0,
                qualified: 1,
                valid: 0,
            });
        });

        it("propB should be not qualified", () => {
            expect(form.$q("propB")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propA"] },
            ]);
        });
    });

    describe("after answering propA with valid answer", () => {
        beforeAll(async () => {
            await form.update("propA", "a");
        });

        it("propB should be qualified", () => {
            expect(form.$q("propB")).toEqual([true, ""]);
        });

        it("should have correct stats", () => {
            expect(form.state.stats).toEqual({
                invalid: 1,
                leaf: 2,
                node: 0,
                progression: 50,
                qualified: 2,
                valid: 1,
            });
        });
    });

    describe("after answering propB with valid answer", () => {
        beforeAll(async () => {
            await form.update("propB", 2);
        });

        it("should have correct stats", () => {
            expect(form.state.stats).toEqual({
                invalid: 0,
                leaf: 2,
                node: 0,
                progression: 100,
                qualified: 2,
                valid: 2,
            });
        });
    });

    describe("after answering propA again with invalid data", () => {
        beforeAll(async () => {
            await form.update("propA", "");
        });

        it("should have correct stats", () => {
            expect(form.state.stats).toEqual({
                invalid: 1,
                leaf: 2,
                node: 0,
                progression: 0,
                qualified: 1,
                valid: 0,
            });
        });

        it("propB should be not qualified", () => {
            expect(form.$q("propB")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propA"] },
            ]);
        });

        it("propB should be not valid", () => {
            expect(form.state.validations.propB).toEqual([
                false,
                Err.SelectorDisqualified,
            ]);
        });

        it("propB value should be null", () => {
            expect(form.$d("propB")).toBeNull();
        });
    });
});

describe("Testing disqualifications with nested objects", () => {
    let form: Form;
    beforeAll(async () => {
        form = await buildSchema({
            __: {
                propA: {
                    type: "string",
                    $v: ["notEmpty"],
                },
                propB: {
                    type: "object",
                    $q: [
                        {
                            isValid: "propA",
                        },
                    ],
                    __: {
                        one: {
                            type: "string",
                            $v: ["notEmpty"],
                        },
                        two: {
                            type: "string",
                            $v: ["notEmpty"],
                        },
                    },
                },
                propC: {
                    type: "object",
                    $q: [
                        {
                            isValid: "propA",
                        },
                    ],
                    __: {
                        one: {
                            type: "string",
                            $v: ["notEmpty"],
                        },
                        two: {
                            $q: [
                                {
                                    isValid: "propC.one",
                                },
                            ],
                            type: "object",
                            __: {
                                other: {
                                    type: "string",
                                    $v: ["notEmpty"],
                                },
                            },
                        },
                    },
                },
            },
        });
        await form.update("propA", "a");
    });

    it("propB should be qualified", () => {
        expect(form.$q("propB")).toEqual([true, ""]);
        expect(form.$v("propB.one")).toEqual([
            false,
            notEmptyValidator.err.IsEmpty,
        ]);
        expect(form.$v("propB.two")).toEqual([
            false,
            notEmptyValidator.err.IsEmpty,
        ]);
    });

    describe("after disqualifying propB", () => {
        beforeAll(async () => {
            // console.log({ state: form.state });
            await form.update("propA", "");
        });

        afterAll(async () => {
            await form.update("propA", "a");
        });

        it("propA should not valid", () => {
            expect(form.$v("propA")).toEqual([
                false,
                notEmptyValidator.err.IsEmpty,
            ]);
        });

        it("propB should not be qualified and valid", () => {
            expect(form.$q("propB")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propA"] },
            ]);
            expect(form.state.validations.propB).toEqual([
                false,
                Err.SelectorDisqualified,
            ]);
        });

        it("propB children should not be qualified", () => {
            expect(form.$q("propB.one")).toEqual([
                false,
                Err.ParentDisqualified,
            ]);
            expect(form.$q("propB.two")).toEqual([
                false,
                Err.ParentDisqualified,
            ]);
        });

        it("propB children should not be valid", () => {
            expect(form.$v("propB.one")).toEqual([
                false,
                Err.SelectorDisqualified,
            ]);
            expect(form.$v("propB.two")).toEqual([
                false,
                Err.SelectorDisqualified,
            ]);
        });
    });

    describe("after disqualifying propC", () => {
        beforeAll(async () => {
            await form.update("propA", "");
        });

        it("propC should not be qualified", () => {
            expect(form.$q("propC")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propA"] },
            ]);
        });

        it("propC should not be valid", () => {
            expect(form.$v("propC")).toEqual([false, Err.SelectorDisqualified]);
        });

        it("propC children should not be qualified", () => {
            expect(form.$q("propC.one")).toEqual([
                false,
                Err.ParentDisqualified,
            ]);
            expect(form.$q("propC.two")).toEqual([
                false,
                Err.ParentDisqualified,
            ]);
            expect(form.$q("propC.two.other")).toEqual([
                false,
                Err.ParentDisqualified,
            ]);
        });

        it("propC children should not be valid", () => {
            expect(form.$v("propC.one")).toEqual([
                false,
                Err.SelectorDisqualified,
            ]);
            expect(form.$v("propC.two")).toEqual([
                false,
                Err.SelectorDisqualified,
            ]);
            expect(form.$v("propC.two.other")).toEqual([
                false,
                Err.SelectorDisqualified,
            ]);
        });
    });

    describe("after qualifying propC", () => {
        beforeAll(async () => {
            await form.update("propA", "a");
        });

        it("propC should be qualified", () => {
            expect(form.$q("propC")).toEqual([true, ""]);
        });

        it("propC should be valid", () => {
            expect(form.$q("propC")).toEqual([true, ""]);
        });

        it("propC children have correct qualifications", () => {
            expect(form.$q("propC.one")).toEqual([true, ""]);
            expect(form.$q("propC.two")).toEqual([
                false,
                isValidValidator.err.SelectorNotValid,
                { selectors: ["propC.one"] },
            ]);
            expect(form.$q("propC.two.other")).toEqual([true, ""]);
        });

        it("propC children have correct validations", () => {
            expect(form.$v("propC.one")).toEqual([
                false,
                notEmptyValidator.err.IsEmpty,
            ]);
            expect(form.$v("propC.two")).toEqual([
                false,
                Err.SelectorDisqualified,
            ]);
            expect(form.$v("propC.two.other")).toEqual([
                false,
                notEmptyValidator.err.IsEmpty,
            ]);
        });
    });
});
