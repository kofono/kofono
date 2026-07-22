// export interface Result<TSuccessValue, TError = Error> {
//     value: TSuccessValue;
//     error?: TError;
//     errorValue?: string;
//     ok(): boolean;
//     fail(): boolean;
// }
//
// export class SuccessResult<TSuccessValue> implements Result<TSuccessValue> {
//     value: TSuccessValue;
//     error: undefined;
//
//     constructor(value: TSuccessValue) {
//         this.value = value;
//         this.error = undefined;
//     }
//
//     ok(): boolean {
//         return true;
//     }
//
//     fail(): boolean {
//         return false;
//     }
// }
//
// export class FailResult<TError = Error> implements Result<undefined, TError> {
//     value: undefined;
//     error?: TError;
//
//     get errorValue(): string {
//         return (this.error as Error)?.message || "";
//     }
//
//     constructor(error: TError | string) {
//         this.error =
//             typeof error === "string" ? (new Error(error) as TError) : error;
//     }
//
//     ok(): boolean {
//         return false;
//     }
//
//     fail(): boolean {
//         return true;
//     }
// }

export type OkOutcome = {
    ok: true;
};

export type FailOutcome<TError = Error> = {
    ok: false;
    error: TError;
};

export type Outcome<TError = Error> = OkOutcome | FailOutcome<TError>;

export const outcome = Object.freeze({
    ok: (): OkOutcome => ({ ok: true }),
    fail: <TError = Error>(error: Error | string): FailOutcome<TError> => ({
        ok: false,
        error: (typeof error === "string" ? new Error(error) : error) as TError,
    }),
});
