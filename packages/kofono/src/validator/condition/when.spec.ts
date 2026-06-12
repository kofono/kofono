import { beforeEach, describe, expect, it, vi } from "vitest";
import { condition } from "./ConditionValidator";
import { when, whenVar } from "./when";

vi.mock("./ConditionValidator", () => ({
    condition: vi.fn(payload => ({ condition: payload })),
}));

describe("when helpers", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("when(selector) -> data placeholder", () => {
        const selector = "user.age";

        const cases: {
            name: string;
            call: () => unknown;
            expected: [string, string, any];
        }[] = [
            {
                name: "isEqualTo",
                call: () => when(selector).isEqualTo(10),
                expected: ["{data:user.age}", "==", 10],
            },
            {
                name: "isTrue",
                call: () => when(selector).isTrue(),
                expected: ["{data:user.age}", "==", true],
            },
            {
                name: "isFalse",
                call: () => when(selector).isFalse(),
                expected: ["{data:user.age}", "==", false],
            },
            {
                name: "isNull",
                call: () => when(selector).isNull(),
                expected: ["{data:user.age}", "==", null],
            },
            {
                name: "isNotEqualTo",
                call: () => when(selector).isNotEqualTo(11),
                expected: ["{data:user.age}", "!=", 11],
            },
            {
                name: "isGreaterThan",
                call: () => when(selector).isGreaterThan(18),
                expected: ["{data:user.age}", ">", 18],
            },
            {
                name: "isGreaterThanOrEqualTo",
                call: () => when(selector).isGreaterThanOrEqualTo(18),
                expected: ["{data:user.age}", ">=", 18],
            },
            {
                name: "isLessThan",
                call: () => when(selector).isLessThan(65),
                expected: ["{data:user.age}", "<", 65],
            },
            {
                name: "isLessThanOrEqualTo",
                call: () => when(selector).isLessThanOrEqualTo(65),
                expected: ["{data:user.age}", "<=", 65],
            },
            {
                name: "includes",
                call: () => when(selector).includes("admin"),
                expected: ["{data:user.age}", "includes", "admin"],
            },
            {
                name: "notIncludes",
                call: () => when(selector).notIncludes("guest"),
                expected: ["{data:user.age}", "!includes", "guest"],
            },
        ];

        for (const testCase of cases) {
            it(`should build condition for ${testCase.name}`, () => {
                const result = testCase.call();

                expect(condition).toHaveBeenCalledTimes(1);
                expect(condition).toHaveBeenCalledWith(testCase.expected);
                expect(result).toEqual({ condition: testCase.expected });
            });
        }
    });

    describe("whenVar(variable) -> var placeholder", () => {
        it("should use var placeholder in condition expression", () => {
            const result = whenVar("counter").isGreaterThan(0);

            expect(condition).toHaveBeenCalledTimes(1);
            expect(condition).toHaveBeenCalledWith(["{var:counter}", ">", 0]);
            expect(result).toEqual({ condition: ["{var:counter}", ">", 0] });
        });
    });
});
