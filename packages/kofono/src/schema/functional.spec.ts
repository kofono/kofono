import { expect, test } from "vitest";
import { K } from "../builder/K";
import { PropertyType } from "../property/types";
import { property, schemaSelectors } from "./functional";

test("test property()", () => {
    let output = property("test", PropertyType.Boolean);
    expect(output).toEqual({
        test: {
            type: "boolean",
        },
    });

    output = property("test", PropertyType.String, ["notEmpty"]);
    expect(output).toEqual({
        test: {
            type: "string",
            $v: ["notEmpty"],
        },
    });
});

test("schemaSelectors", () => {
    expect(
        schemaSelectors(
            K.schema({
                propA: K.string(),
                propB: K.string(),
                propC: K.object({
                    propD: K.string(),
                    propE: K.object({
                        propF: K.string(),
                    }),
                }),
                propG: K.array(
                    K.object({
                        propH: K.string(),
                        propI: K.string(),
                    }).set("min", 1),
                ),
            }),
        ),
    ).toEqual([
        "propA",
        "propB",
        "propC",
        "propC.propD",
        "propC.propE",
        "propC.propE.propF",
        "propG",
    ]);
});
