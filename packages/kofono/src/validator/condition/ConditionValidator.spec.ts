import { describe, expect, it } from "vitest";
import { buildSchema } from "../../builder/helpers";
import { K } from "../../builder/K";
import type { ValidationContext } from "../types";
import { ConditionValidator } from "./ConditionValidator";
import type { Condition } from "./types";

describe("ConditionValidator test", () => {
    const schema = K.schema({
        test: K.string(),
        foobar: K.number().default(9),
    });
    const tests: {
        condition: Condition;
        value: string;
        expected: boolean;
    }[] = [
        {
            condition: ["{self}", "==", "test"],
            value: "test",
            expected: true,
        },
        {
            condition: ["{self}", "==", "test2"],
            value: "test",
            expected: false,
        },
        {
            condition: ["{data:foobar}", "==", 9],
            value: "test",
            expected: true,
        },
    ];

    for (const test of tests) {
        it(`should condition ${JSON.stringify(test.condition)} return ${test.expected}`, async () => {
            const form = await buildSchema(schema);
            const validator = new ConditionValidator(
                "test",
                "validation",
                test.condition,
            );

            const ctx: ValidationContext = {
                form: form,
                selector: "test",
                value: test.value,
            };

            await form.update("test", test.value);

            const [isValid] = validator.validate(ctx);
            expect(isValid).toEqual(test.expected);
        });
    }
});
