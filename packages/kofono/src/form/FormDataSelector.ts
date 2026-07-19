import { DataSelector } from "../selector/DataSelector";
import type { DataQuerier } from "../selector/types";
import type { Form } from "./Form";

export class FormDataSelector implements DataQuerier {
    constructor(
        private form: Form,
        private selector: DataSelector,
    ) {}

    has(selector: string): boolean {
        return this.selector.has(selector, this.form.state.data);
    }

    get<T>(selector: string): T {
        return this.selector.get(selector, this.form.state.data) as T;
    }

    getOrDefault<T>(selector: string, defaultValue: T): T {
        const [hasSelector, value] = this.selector.tryGet(
            selector,
            this.form.state.data,
        );
        return hasSelector ? (value as T) : defaultValue;
    }

    tryGet(selector: string): [boolean, unknown] {
        return this.selector.tryGet(selector, this.form.state.data);
    }

    set(selector: string, value: unknown): void {
        this.selector.set(selector, value, this.form.state.data);
    }

    trySet(selector: string, value: unknown): [boolean, string | null] {
        return this.selector.trySet(selector, value, this.form.state.data);
    }

    delete(selector: string): void {
        this.selector.delete(selector, this.form.state.data);
    }

    tryDelete(selector: string): [boolean, string | null] {
        return this.selector.tryDelete(selector, this.form.state.data);
    }
}
