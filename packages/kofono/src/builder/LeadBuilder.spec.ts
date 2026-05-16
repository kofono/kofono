import { describe, expect, it, test } from "vitest";
import { PropertyType, TreeType } from "../property/types";
import { LeafBuilder } from "./LeafBuilder";

test("LeafBuilder test", () => {
    const leafBuilder = new LeafBuilder("uid", {
        type: PropertyType.String,
    });
    const prop = leafBuilder.build();
    expect(prop.treeType).toEqual(TreeType.Leaf);
    expect(prop.type).toEqual(PropertyType.String);
});

describe("LeafBuilder normalizeEnum", () => {
    const leafBuilder = new LeafBuilder("uid", {
        type: PropertyType.String,
        enum: ["foo", "bar"],
    });
    const prop = leafBuilder.build();
    it("should normalize enum values", () => {
        expect(prop.get("enum", [])).toEqual([
            { value: "foo" },
            { value: "bar" },
        ]);
    });
});
