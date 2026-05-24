import { beforeAll, describe, expect, it } from "vitest";
import { SchemaBuilder } from "../../builder/SchemaBuilder";
import type { Form } from "../../form/Form";
import type { ValidationContext } from "../types";
import { PasswordValidator, passwordValidator } from "./PasswordValidator";

describe("PasswordValidator", () => {
    let form: Form;
    let ctx: ValidationContext;

    beforeAll(async () => {
        form = await new SchemaBuilder().buildEmpty();
        ctx = {
            selector: "password",
            value: "",
            form: form,
        };
    });

    it("should fail if value is empty", () => {
        const validator = new PasswordValidator("password", "validation", {});
        ctx.value = "";
        const [isValid, error] = validator.validate(ctx);
        expect(isValid).toBe(false);
        expect(error).toBe(passwordValidator.err.IsEmpty);
    });

    it("should fail if shorter than min length!", () => {
        const validator = new PasswordValidator("password", "validation", {
            min: 5,
        });
        ctx.value = "1234";
        const [isValid, error] = validator.validate(ctx);
        expect(isValid).toBe(false);
        expect(error).toBe(passwordValidator.err.MinLength);
    });

    it("should pass if length is equal to min length", () => {
        const validator = new PasswordValidator("password", "validation", {
            min: 5,
        });
        ctx.value = "12345";
        const [isValid] = validator.validate(ctx);
        expect(isValid).toBe(true);
    });

    it("should fail if longer than max length", () => {
        const validator = new PasswordValidator("password", "validation", {
            max: 5,
        });
        ctx.value = "123456";
        const [isValid, error] = validator.validate(ctx);
        expect(isValid).toBe(false);
        expect(error).toBe(passwordValidator.err.MaxLength);
    });

    it("should pass if length is equal to max length", () => {
        const validator = new PasswordValidator("password", "validation", {
            max: 5,
        });
        ctx.value = "12345";
        const [isValid] = validator.validate(ctx);
        expect(isValid).toBe(true);
    });

    describe("character requirements", () => {
        it("should fail if lowerCase is true and no lowercase char present", () => {
            const validator = new PasswordValidator("password", "validation", {
                lowerCase: true,
            });
            ctx.value = "UPPER123!";
            const [isValid, error] = validator.validate(ctx);
            expect(isValid).toBe(false);
            expect(error).toBe(passwordValidator.err.NoLowerCase);
        });

        it("should fail if upperCase is true and no uppercase char present", () => {
            const validator = new PasswordValidator("password", "validation", {
                upperCase: true,
            });
            ctx.value = "lower123!";
            const [isValid, error] = validator.validate(ctx);
            expect(isValid).toBe(false);
            expect(error).toBe(passwordValidator.err.UpperCase);
        });

        it("should fail if numbers is true and no number present", () => {
            const validator = new PasswordValidator("password", "validation", {
                numbers: true,
            });
            ctx.value = "LowerUpper!";
            const [isValid, error] = validator.validate(ctx);
            expect(isValid).toBe(false);
            expect(error).toBe(passwordValidator.err.Numbers);
        });

        it("should fail if specialChars is true and no special char present", () => {
            const validator = new PasswordValidator("password", "validation", {
                specialChars: true,
            });
            ctx.value = "LowerUpper123";
            const [isValid, error] = validator.validate(ctx);
            expect(isValid).toBe(false);
            expect(error).toBe(passwordValidator.err.SpecialChars);
        });
    });

    it("should pass with custom specialCharsList", () => {
        const validator = new PasswordValidator("password", "validation", {
            specialChars: true,
            specialCharsList: "?",
        });
        ctx.value = "abc?";
        const [isValid] = validator.validate(ctx);
        expect(isValid).toBe(true);

        ctx.value = "abc!"; // ! is default but not in our custom list
        const [isValid2] = validator.validate(ctx);
        expect(isValid2).toBe(false);
    });
});
