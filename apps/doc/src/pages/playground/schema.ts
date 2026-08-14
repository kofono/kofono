import { K, max, min, required, type Schema } from "kofono";

const evalContext = { K, min, max, required /* add more as needed */ };

export function evalWithContext(code: string): Schema {
    const keys = Object.keys(evalContext);
    const values = Object.values(evalContext);
    return new Function(...keys, `return (${code})`)(...values);
}
