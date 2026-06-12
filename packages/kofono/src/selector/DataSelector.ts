import type { Data } from "../form/types";

export class DataSelectorNotFoundError extends Error {
    constructor(public readonly selector: string) {
        super(`Data selector "${selector}" not found`);
    }
}

export class DataSelectorIndexOutOfBoundsError extends Error {
    constructor(
        public readonly index: number,
        public readonly length: number,
    ) {
        super(
            `Array index ${index} out of bounds on array of length ${length}`,
        );
    }
}

export class DataSelector {
    // separator and wildcard must be only one char
    public static readonly separator = ".";

    private resolvedSelectors: Record<string, string[]> = {};

    splitSelector(selector: string): string[] {
        if (!this.resolvedSelectors[selector]) {
            this.resolvedSelectors[selector] = selector.split(
                DataSelector.separator,
            );
        }
        return this.resolvedSelectors[selector];
    }

    get(selector: string, data: Data): any {
        return this._get(this.splitSelector(selector), data, selector);
    }

    getOrDefault<T>(selector: string, defaultValue: T, data: Data): T {
        const [hasSelector, value] = this.tryGet(selector, data);
        return hasSelector ? (value as T) : defaultValue;
    }

    tryGet(selector: string, data: Data): [boolean, unknown] {
        try {
            return [
                true,
                this._get(this.splitSelector(selector), data, selector),
            ];
        } catch (e) {
            return [false, e];
        }
    }

    set(selector: string, value: unknown, data: Data): void {
        this._set(selector, value, data);
    }

    trySet(
        selector: string,
        value: unknown,
        data: Data,
    ): [boolean, string | null] {
        try {
            this._set(selector, value, data);
            return [true, null];
        } catch (e) {
            return [false, (e as Error).message];
        }
    }

    delete(selector: string, data: Data): void {
        if (this.has(selector, data)) {
            this._delete(selector, data);
        }
    }

    tryDelete(selector: string, data: Data): [boolean, string | null] {
        if (!this.has(selector, data)) {
            return [false, "selector not found"];
        }
        try {
            this._delete(selector, data);
            return [true, null];
        } catch (e) {
            return [false, (e as Error).message];
        }
    }

    has(selector: string, data: Data): boolean {
        const [success] = this.tryGet(selector, data);
        return success;
    }

    protected _get(
        paths: string[],
        data: Data,
        originalSelector: string,
    ): unknown {
        if (paths.length > 0) {
            const dataKey = data[paths[0]];
            if (dataKey !== undefined) {
                if (paths.length - 1 === 0) {
                    return dataKey;
                } else if (dataKey !== null && typeof dataKey === "object") {
                    return this._get(
                        paths.slice(1, paths.length),
                        dataKey,
                        originalSelector,
                    );
                }
                throw new DataSelectorNotFoundError(originalSelector);
            } else if (Object.hasOwn(data, paths[0])) {
                // value is undefined but the key path exists, so it's an explicit value
                return undefined;
            }
        }
        throw new DataSelectorNotFoundError(originalSelector);
    }

    protected _set(propPath: string, value: unknown, obj: any): void {
        const [head, ...rest] = propPath.split(DataSelector.separator);

        // block prototype pollution
        if (
            head === "__proto__" ||
            head === "constructor" ||
            head === "prototype"
        ) {
            return;
        }

        if (!rest.length) {
            obj[head] = value;
            return;
        }

        if (Array.isArray(obj)) {
            const index = parseInt(head, 10);
            if (Number.isNaN(index) || index < 0 || index > obj.length) {
                throw new DataSelectorIndexOutOfBoundsError(index, obj.length);
            }
            if (index === obj.length) {
                obj.push({});
            }
        }

        this._set(rest.join(DataSelector.separator), value, obj[head]);
    }

    protected _delete(propPath: string, obj: any): void {
        const [head, ...rest] = propPath.split(DataSelector.separator);
        if (!rest.length) {
            Array.isArray(obj)
                ? obj.splice(parseInt(head, 10), 1)
                : delete obj[head];
        } else {
            this._delete(rest.join(DataSelector.separator), obj[head]);
        }
    }
}
