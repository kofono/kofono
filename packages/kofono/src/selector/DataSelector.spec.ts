import { describe, expect, it, test } from "vitest";
import {
    DataSelector,
    DataSelectorIndexOutOfBoundsError,
    DataSelectorNotFoundError,
} from "./DataSelector";

const data = {
    a: "foo",
    b: false,
    c: {
        c1: "bar",
        c2: 42,
        c3: {
            c31: "baz",
        },
    },
    d: ["foo", "bar", "baz"],
    e: [
        {
            e1: "foo",
        },
        {
            e2: "bar",
        },
        {
            e3: "baz",
        },
    ],
    f: null,
    g: {
        g1: undefined,
    },
    h: [undefined],
};

const dataTests: Array<Array<any>> = [
    ["a", data.a],
    ["b", data.b],
    ["c", data.c],
    ["c.c1", data.c.c1],
    ["c.c2", data.c.c2],
    ["c.c3", data.c.c3],
    ["c.c3.c31", data.c.c3.c31],
    ["d", data.d],
    ["d.0", data.d[0]],
    ["d.1", data.d[1]],
    ["d.2", data.d[2]],
    ["e", data.e],
    ["e.0", data.e[0]],
    ["e.0.e1", data.e[0].e1],
    ["e.1", data.e[1]],
    ["e.1.e2", data.e[1].e2],
    ["e.2", data.e[2]],
    ["e.2.e3", data.e[2].e3],
    ["f", data.f],
    ["g", data.g],
    ["g.g1", data.g.g1],
    ["h", data.h],
    ["h.0", data.h[0]],
];

test("selector get data", () => {
    const selector = new DataSelector();
    for (const [s, expected] of dataTests) {
        expect(selector.get(s, data)).toEqual(expected);
    }
});

test("selector get data from invalid path", () => {
    const selector = new DataSelector();
    expect(() => {
        selector.get("unknown.path", data);
    }).toThrow(DataSelectorNotFoundError);
});

describe("DataSelector Prototype Pollution", () => {
    it("should prevent prototype pollution via _set", () => {
        const selector = new DataSelector();
        const target: any = {};

        // Before pollution: an empty object does not have the 'polluted' property
        const check: any = {};
        expect(check.polluted).toBeUndefined();

        // Triggering prototype pollution
        // This will effectively do: target['__proto__']['polluted'] = 'yes'
        selector.set("__proto__.polluted", "yes", target);

        // After pollution: 'polluted' property exists on ALL objects
        // because it was added to Object.prototype
        expect(({} as any).polluted).toBeUndefined();

        // Clean up to avoid affecting other tests
        delete (Object.prototype as any).polluted;
    });

    it("should prevent prototype pollution via constructor.prototype", () => {
        const selector = new DataSelector();
        const target: any = {};

        const check: any = {};
        expect(check.pollutedByConstructor).toBeUndefined();

        // Another variant of prototype pollution
        selector.set(
            "constructor.prototype.pollutedByConstructor",
            "yes",
            target,
        );

        expect(({} as any).pollutedByConstructor).toBeUndefined();
    });
});

describe("DataSelector array index bounds", () => {
    it("appends when setting at index 0 on an empty array", () => {
        const selector = new DataSelector();
        const data: any[] = [];

        selector.set("0.name", "Alice", data);

        expect(data[0].name).toBe("Alice");
    });

    it("appends when setting at index equal to array length", () => {
        const selector = new DataSelector();
        const data: any[] = [{ name: "Bob" }];

        selector.set("1.name", "Alice", data);

        expect(data[1].name).toBe("Alice");
        expect(data[0].name).toBe("Bob");
    });

    it("mutates when setting at a valid existing index", () => {
        const selector = new DataSelector();
        const data: any[] = [{ name: "" }, { name: "" }];

        selector.set("1.name", "Alice", data);

        expect(data[1].name).toBe("Alice");
        expect(data[0].name).toBe("");
    });

    it("throws when skipping indices", () => {
        const selector = new DataSelector();
        const data: any[] = [];

        expect(() => selector.set("2.name", "Alice", data)).toThrow(
            DataSelectorIndexOutOfBoundsError,
        );
    });

    it("throws when setting at a negative index", () => {
        const selector = new DataSelector();
        const data: any[] = [{ name: "" }];

        expect(() => selector.set("-1.name", "Alice", data)).toThrow(
            DataSelectorIndexOutOfBoundsError,
        );
    });

    it("throws when skipping indices with a selector that has no nested path", () => {
        const selector = new DataSelector();
        const data: any[] = ["test", "foo"];
        expect(() => selector.set("99", "Alice", data)).toThrow(
            DataSelectorIndexOutOfBoundsError,
        );
    });

    it("trySet() returns false with error message on out-of-bounds", () => {
        const selector = new DataSelector();
        const data: any[] = [];

        const [success, error] = selector.trySet("2.name", "Alice", data);

        expect(success).toBe(false);
        expect(error).toContain("out of bounds");
    });

    it("should block prototype pollution via has()", () => {
        const selector = new DataSelector();
        const data: any[] = [];

        expect(selector.has("__proto__.toString", data)).toBe(false);
    });

    it("should prevent prototype tampering via _delete()", () => {
        const selector = new DataSelector();
        const target: any = {};
        const originalToString = Object.prototype.toString;

        try {
            selector.delete("__proto__.toString", target);

            expect(Object.hasOwn(Object.prototype, "toString")).toBe(true);
            expect(String({})).toBe("[object Object]");
        } finally {
            // restore as non-enumerable
            Object.defineProperty(Object.prototype, "toString", {
                value: originalToString,
                writable: true,
                enumerable: false,
                configurable: true,
            });
        }
    });
});

test("has() returns false when intermediate key is missing but last segment exists at that level", () => {
    const selector = new DataSelector();
    const data = {
        a: { x: undefined }, // "x" exists under "a"
    };

    // "a.b.x" — "b" is missing from "a", but "x" exists on "a"
    // _get(["b","x"], { x: undefined }, "a.b.x"):
    //   data["b"] = undefined → else if: Object.hasOwn({ x: undefined }, "x") = true
    //   incorrectly returns undefined instead of throwing
    expect(selector.has("a.b.x", data)).toBe(false); // FAILS: returns true
});
