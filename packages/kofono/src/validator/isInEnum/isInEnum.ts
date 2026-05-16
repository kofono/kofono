import type { SchemaPropertyEnum } from "../../schema/Schema";
import type { ValidationContext } from "../types";

export function isInEnum(ctx: ValidationContext): boolean {
    const propEnum: SchemaPropertyEnum<any>[] | undefined = ctx.form
        .prop(ctx.selector)
        .get("enum", []);

    if (!propEnum) {
        return false;
    }

    const result = propEnum.filter(x => x.value === ctx.value);
    return result.length > 0;
}
