import { uuidV4 } from "../common/helpers";
import type { Form } from "./Form";
import type { State } from "./types";

export function generateNewFormState(): State {
    return {
        sessionId: uuidV4(),
        data: {},
        stats: {
            qualified: 0,
            valid: 0,
            invalid: 0,
            progression: 0,
            node: 0,
            leaf: 0,
        },
        meta: {
            hasBeenUpdated: [],
            extensions: [],
        },
        pass: [false, "FORM_INITIALIZED"],
        qualifications: {},
        validations: {},
    } as State;
}

export function getInvalidSelectors(form: Form): string[] {
    return Object.entries(form.state.validations)
        .filter(x => !x[1][0])
        .map(x => x[0]);
}

export function getValidSelectors(form: Form): string[] {
    return Object.entries(form.state.validations)
        .filter(x => x[1][0])
        .map(x => x[0]);
}

export function getUnqualifiedSelectors(form: Form): string[] {
    return Object.entries(form.state.qualifications)
        .filter(x => !x[1][0])
        .map(x => x[0]);
}

export function getQualifiedSelectors(form: Form): string[] {
    return Object.entries(form.state.qualifications)
        .filter(x => x[1][0])
        .map(x => x[0]);
}
