import { describe, expect, it } from "vitest";
import { K } from "../../builder/K";
import type { Form } from "../../form/Form";
import type { ValidationContext } from "../types";
import {
    evaluateCondition,
    parseConditionPlaceholders,
    parsePlaceholders,
} from "./condition";
import type { Condition, Placeholder } from "./types";

describe("parsePlaceholders()", () => {
    const tests: {
        template: string;
        results: Placeholder[];
    }[] = [
        {
            template: "",
            results: [],
        },
        {
            template: "{data:my.selector}",
            results: [
                {
                    type: "data",
                    path: "my.selector",
                },
            ],
        },
        {
            template: "{var:my.selector}",
            results: [
                {
                    type: "var",
                    path: "my.selector",
                },
            ],
        },
        {
            template: "{qualification:my.selector}",
            results: [
                {
                    type: "qualification",
                    path: "my.selector",
                },
            ],
        },
        {
            template: "{validation:my.selector}",
            results: [
                {
                    type: "validation",
                    path: "my.selector",
                },
            ],
        },
        {
            template: "{def:my.selector}",
            results: [
                {
                    type: "def",
                    path: "my.selector",
                },
            ],
        },
        {
            template: "{self}",
            results: [
                {
                    type: "self",
                    path: "",
                },
            ],
        },
        {
            template: "{data:my.selector}/{self}",
            results: [
                {
                    type: "data",
                    path: "my.selector",
                },
                {
                    type: "self",
                    path: "",
                },
            ],
        },
        {
            template: "{data:my.selector|toLowerCase}/{self}",
            results: [
                {
                    type: "data",
                    path: "my.selector",
                    modifier: "toLowerCase",
                },
                {
                    type: "self",
                    path: "",
                },
            ],
        },
    ];

    for (const test of tests) {
        it(`should parse ${test.template} correctly`, () => {
            const results = parsePlaceholders(test.template);
            expect(results).toEqual(test.results);
        });
    }
});

describe("testing var and def type", () => {
    it("should use var for the condition", async () => {
        const form = await K.form({
            $vars: {
                user: {
                    role: "admin",
                },
            },
            something: K.string().$q(q =>
                q.condition("{var:user.role}", "==", "admin"),
            ),
            somethingElse: K.string().$q(q =>
                q.condition("{var:user.role}", "==", "user"),
            ),
        });

        expect(form.state.qualifications.something[0]).toBeTruthy();
        expect(form.state.qualifications.somethingElse[0]).toBeFalsy();
    });
    it("should use def for the condition", async () => {
        const form = await K.form({
            something: K.string()
                .props({
                    test: {
                        name: "bob",
                    },
                })
                .$q(q => q.condition("{def:test.name}", "==", "bob")),
        });

        expect(form.state.qualifications.something[0]).toBeTruthy();
    });
});

describe("evaluateFieldValue()", () => {
    it("should handle modifiers", async () => {
        const form = await K.form({
            name: K.string().default("BOB"),
            something: K.string().$q(q =>
                q.condition("{data:name|toLowerCase}", "==", "bob"),
            ),
            somethingElse: K.string().$q(q =>
                q.condition("{data:name}", "==", "bob"),
            ),
        });

        expect(form.state.qualifications.something[0]).toBeTruthy();
        expect(form.state.qualifications.somethingElse[0]).toBeFalsy();
        await form.update("name", "foobar");
        expect(form.state.qualifications.something[0]).toBeFalsy();
    });
});

describe("evaluateCondition()", () => {
    async function newForm() {
        return await K.form({
            name: K.string().default("bob"),
            role: K.string().default("admin"),
            age: K.number().default(25),
            country: K.string().default("QC"),
            tags: K.listString().default(["tagA", "tagB", "tagC"]),
            acceptTerms: K.boolean()
                .default(false)
                .$v(v => v.required()),
            subscribeNewsletter: K.boolean()
                .default(false)
                .$q(q => q.condition("{data:acceptTerms}", "==", true)),
            subscribeToMonthlyNewsletter: K.boolean()
                .default(false)
                .$q(q =>
                    q.conditions([
                        ["{data:acceptTerms}", "==", true],
                        "and",
                        ["{data:subscribeNewsletter}", "==", true],
                    ]),
                ),
        });
    }

    const tests: {
        id: string;
        selector: string;
        condition: Condition;
        expected: boolean;
        context?: ValidationContext;
        value?: any;
        before?: (f: Form) => Promise<void>;
    }[] = [
        {
            id: "should evaluate == condition",
            selector: "name",
            condition: ["admin", "==", "admin"],
            expected: true,
        },
        {
            id: "should evaluate != condition",
            selector: "name",
            condition: ["admin", "!=", "user"],
            expected: true,
        },
        {
            id: "should evaluate self == condition",
            condition: ["{self}", "==", "bob"],
            selector: "name",
            expected: true,
        },
        {
            id: "should evaluate simple inequality condition",
            condition: ["{data:tags}", "includes", "tagA"],
            selector: "name",
            expected: true,
        },
        {
            id: "should evaluate simple inequality condition",
            condition: ["{data:tags}", "includes", "tagD"],
            selector: "name",
            expected: false,
        },
        {
            id: "should evaluate do not include condition",
            condition: ["{data:tags}", "!includes", "tagP"],
            selector: "name",
            expected: true,
        },
        {
            id: "should evaluate condition with relation",
            condition: [
                ["{data:tags}", "includes", "tagD"],
                "or",
                ["{data:tags}", "includes", "tagC"],
            ],
            selector: "name",
            expected: true,
        },
        {
            id: "should evaluate nested condition with relation",
            condition: [
                [
                    [`{data:tags}`, "includes", "tagA"],
                    "or",
                    ["{data:tags}", "includes", "tagY"],
                ],
                "and",
                [
                    ["{data:tags}", "includes", "tagX"],
                    "or",
                    ["{data:tags}", "includes", "tagB"],
                ],
            ],
            selector: "name",
            expected: true,
        },
        {
            id: "should evaluate condition with relations",
            condition: [
                ["{data:age}", "<", 30],
                "and",
                ["{data:age}", "<", 26],
                "and",
                ["{data:age}", "<", 26],
                "and",
                ["{data:age}", ">", 21],
            ],
            selector: "name",
            expected: true,
        },
        {
            id: "should handle deeply nested conditions",
            condition: [
                ["{data:role}", "==", "admin"],
                "and",
                [
                    ["{data:tags}", "includes", "tagB"],
                    "or",
                    ["{data:tags}", "includes", "tagC"],
                ],
                "and",
                ["{data:age}", ">=", 25],
            ],
            selector: "name",
            expected: true,
        },
        {
            id: "should handle super ridiculous deeply nested conditions",
            condition: [
                ["{data:role}", "==", "admin"],
                "and",
                [
                    ["{data:tags}", "includes", "tagA"],
                    "and",
                    [
                        ["{data:tags}", "includes", "tagB"],
                        "and",
                        [
                            ["{data:tags}", "includes", "tagC"],
                            "and",
                            [
                                ["{data:tags}", "includes", "tagA"],
                                "and",
                                [
                                    ["{data:tags}", "includes", "tagB"],
                                    "and",
                                    ["{data:tags}", "includes", "UNKNOWN"],
                                ],
                            ],
                        ],
                    ],
                ],
                "and",
                ["{data:age}", ">=", 25],
            ],
            selector: "name",
            expected: false,
        },
        {
            id: "should handle qualification",
            condition: ["{qualification:subscribeNewsletter}", "==", true],
            selector: "name",
            expected: false,
        },
        {
            id: "should handle qualification",
            condition: ["{data:acceptTerms}", "==", true],
            selector: "name",

            before: async f => {
                // console.log(f.state.qualifications, "a2s");
                await f.update("acceptTerms", true);
                // console.log(f.state.qualifications.subscribeNewsletter, "a2s2");
            },
            expected: true,
        },
        // {
        //     name: "should evaluate greater than condition",
        //     condition: ["age", ">", 18],
        //     // context: { age: 25 },
        //     expected: true,
        // },
        // {
        //     name: "should evaluate less than or equal condition",
        //     condition: ["age", "<=", 18],
        //     // context: { age: 18 },
        //     expected: true,
        // },
        // {
        //     name: "should evaluate includes condition",
        //     condition: ["tags", "includes", "frontend"],
        //     // context: { tags: "frontend,backend,fullstack" },
        //     expected: true,
        // },
        // {
        //     name: "should evaluate OR condition with true result",
        //     condition: [["role", "==", "admin"], "or", ["age", ">=", 18]],
        //     // context: { role: "user", age: 25 },
        //     expected: true,
        // },
        // {
        //     name: "should evaluate OR condition with false result",
        //     condition: [["role", "==", "admin"], "or", ["age", ">=", 18]],
        //     // context: { role: "user", age: 15 },
        //     expected: false,
        // },
        // {
        //     name: "should evaluate AND condition with true result",
        //     condition: [["age", ">=", 18], "and", ["country", "==", "CA"]],
        //     // context: { age: 25, country: "CA" },
        //     expected: true,
        // },
        // {
        //     name: "should evaluate AND condition with false result",
        //     condition: [["age", ">=", 18], "and", ["country", "==", "CA"]],
        //     // context: { age: 25, country: "US" },
        //     expected: false,
        // },
        // {
        //     name: "should evaluate complex nested condition",
        //     condition: [
        //         ["role", "==", "admin"],
        //         "or",
        //         [["age", ">=", 18], "and", ["country", "==", "CA"]],
        //     ],
        //     // context: { role: "user", age: 25, country: "CA" },
        //     expected: true,
        // },
        // {
        //     name: "should evaluate complex nested condition with false result",
        //     condition: [
        //         ["role", "==", "admin"],
        //         "or",
        //         [["age", ">=", 18], "and", ["country", "==", "CA"]],
        //     ],
        //     // context: { role: "user", age: 15, country: "US" },
        //     expected: false,
        // },
        // {
        //     name: "should evaluate equality for provided field",
        //     condition: ["invalid", "==", "test"],
        //     // context: { invalid: "test" },
        //     expected: true,
        // },
        // {
        //     name: "should handle string field lookups properly",
        //     condition: ["role", "==", "admin"],
        //     // context: { role: "admin" },
        //     expected: true,
        // },
        // {
        //     name: "should handle mixed operators",
        //     condition: [
        //         ["age", ">=", 18],
        //         "and",
        //         [["country", "==", "CA"], "or", ["country", "==", "US"]],
        //     ],
        //     // context: { age: 25, country: "CA" },
        //     expected: true,
        // },
        // {
        //     name: "should handle string includes with complex values",
        //     condition: ["skills", "includes", "javascript"],
        //     // context: { skills: "javascript,typescript,nodejs" },
        //     expected: true,
        // },
        // {
        //     name: "should handle string includes with no match",
        //     condition: ["skills", "includes", "python"],
        //     // context: { skills: "javascript,typescript,nodejs" },
        //     expected: false,
        // },
        // {
        //     name: "should handle deeply nested string includes",
        //     condition: [
        //         [
        //             ["role", "!=", "admin"],
        //             "and",
        //             [["role", "==", "dev"], "or", ["role", "==", "mod"]],
        //             "and",
        //             ["role", "!=", "tester"],
        //         ],
        //     ],
        //     // context: { role: "text" },
        //     expected: true,
        // },
    ];

    for (const t of tests)
        it(t.id, async () => {
            const form = await newForm();

            if (t.before) {
                await t.before(form);
            }

            const context = {
                form,
                selector: t.selector ?? "test",
                value: t.value ?? "test",
            };
            const placeholders = parseConditionPlaceholders(t.condition, {});

            expect(evaluateCondition(t.condition, context, placeholders)).toBe(
                t.expected,
            );
        });
});
