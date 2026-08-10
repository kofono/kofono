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

export function okResult(): OkResult {
    return { ok: true };
}

export function failResult<TError = string>(error: TError): FailResult<TError> {
    return {
        ok: false,
        error,
    };
}

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

export function okResultValue<TValue>(value: TValue): OkResultValue<TValue> {
    return { ok: true, value };
}

export function failResultValue<TError = string>(
    error: TError,
): FailResultValue<TError> {
    return {
        ok: false,
        error,
    };
}
