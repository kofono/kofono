import { beforeAll, describe, expect, it, test } from "vitest";
import {
    defaultPassHandler,
    ExtensionsFactory,
    FormEnv,
    ValidatorErrors,
} from "../";
import { IsValidValidator } from "../validator/isValid/IsValidValidator";
import { ValidatorsFactory } from "../validator/ValidatorsFactory";
import { Builder } from "./Builder";

test("builder object", () => {
    const builder = new Builder();

    builder.object("main", {
        __: {},
        test: "ok",
    });

    expect(builder.errors()).toHaveLength(0);
    expect(builder.uids()).toHaveLength(1);
    expect(builder.uids()[0]).toBe("main");
});

test("builder unique uid", () => {
    const builder = new Builder();

    builder.object("main", {
        __: {},
    });
    builder.object("main", {
        __: {},
    });

    expect(builder.errors()).toHaveLength(1);
    expect(builder.uids()).toHaveLength(1);
    expect(builder.errors()[0].message).toBe("Duplicate property uid: main");
});

test("Builder simplified syntax", async () => {
    const builder = new Builder();

    builder.string("propA", {
        $v: ["notEmpty"],
    });

    const form = await builder.build();
    expect(form.hasProp("propA")).toBeTruthy();
    expect(form.$v("propA")).toEqual([false, ValidatorErrors.NotEmpty.IsEmpty]);
});

describe("Builder FormConfig", () => {
    let builder: Builder;
    beforeAll(() => {
        builder = new Builder();
    });

    it("default config should be set to prod", async () => {
        const form = await builder.build();
        expect(form.env).toEqual("prod");
    });

    it("custom config should be set", async () => {
        const customValidatorsFactory = new ValidatorsFactory();
        let passHandler = false;
        customValidatorsFactory.register("fake", () => {
            return new IsValidValidator("foo", "validation", {
                selectors: "foo",
            });
        });
        const form = await builder.build({
            env: FormEnv.test,
            validatorsFactory: customValidatorsFactory,
            extensionsFactory: new ExtensionsFactory(),
            passHandler: form => {
                passHandler = true;
                return defaultPassHandler(form);
            },
            vars: {},
        });
        expect(form.env).toEqual(FormEnv.test);
        expect(passHandler).toBeTruthy();
        expect(form.validatorsFactory.has("fake")).toBeTruthy();
        expect(form.validatorsFactory.has("notEmpty")).toBeTruthy();
    });
});
