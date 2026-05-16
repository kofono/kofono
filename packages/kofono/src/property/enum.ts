import { isObjectLiteral } from "../common/helpers";
import type { SchemaPropertyEnum } from "../schema/Schema";

export function normalizeEnumDef(
    enumDef: unknown,
): SchemaPropertyEnum<unknown>[] | undefined {
    if (
        enumDef &&
        Array.isArray(enumDef) &&
        enumDef.length > 0 &&
        !isObjectLiteral(enumDef[0])
    ) {
        const newEnum: SchemaPropertyEnum<unknown>[] = [];
        for (const item of enumDef) {
            newEnum.push({ value: item });
        }
        return newEnum;
    }
    return enumDef as SchemaPropertyEnum<unknown>[] | undefined;
}
