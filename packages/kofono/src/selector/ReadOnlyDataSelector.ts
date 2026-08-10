import { DataSelector } from "./DataSelector";
import { ReadOnlySelectorError } from "./ReadOnlySelectorError";

export class ReadOnlyDataSelector extends DataSelector {
    protected _delete(selector: string, _data: any): void {
        throw new ReadOnlySelectorError("delete", selector);
    }

    protected _set(selector: string, _value: unknown, _data: any): void {
        throw new ReadOnlySelectorError("set", selector);
    }
}
