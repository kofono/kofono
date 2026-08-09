export class ReadOnlySelectorError extends Error {
    constructor(operation: string, selector: string) {
        super(
            `Operation "${operation}" on ["${selector}"] is not allowed on read-only selector`,
        );
    }
}
