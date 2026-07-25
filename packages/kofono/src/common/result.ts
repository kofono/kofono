/**
 * Simple Result true/false
 */
export type Result<TError = string> = OkResult | FailResult<TError>;

export type OkResult = {
    ok: true;
};

export type FailResult<TError = string> = {
    ok: false;
    error: TError;
};

export const result = Object.freeze({
    ok: (): OkResult => ({ ok: true }),
    fail: <TError = string>(error: TError): FailResult<TError> => ({
        ok: false,
        error,
    }),
});

/**
 * Result with value or error
 */
export type ResultValue<TValue = any, TError = string> =
    | OkResultValue<TValue>
    | FailResultValue<TError>;

export type OkResultValue<TValue> = {
    ok: true;
    value: TValue;
};

export type FailResultValue<TError = string> = {
    ok: false;
    error: TError;
};

export const resultValue = Object.freeze({
    ok: <TValue = any>(value: TValue): OkResultValue<TValue> => ({
        ok: true,
        value,
    }),
    fail: <TError = string>(error: TError): FailResultValue<TError> => ({
        ok: false,
        error,
    }),
});
