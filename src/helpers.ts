import defaultMessages from "./errors";

import type {
    FormCheckerDefaultMessages,
    FormCheckerError,
    FormCheckerLanguages,
    FormCheckerValue
} from "./types";

export function isEmpty(value: FormCheckerValue) : boolean {
    return (
        value === undefined ||
        value === null ||
        value.toString().trim() === ''
    );
};

export function isInvalidNumber(value: string) : boolean {
    return isNaN(parseInt(value));
}

export function isSameType<T>(a: T, b: unknown): b is T {
    return typeof b === typeof a;
}

export function isNotEqual(a: unknown, b: unknown): boolean {
    return a !== b;
}

export function getDefaultMessage(error : FormCheckerError, language : FormCheckerDefaultMessages | FormCheckerLanguages) : string {
    if(typeof language === 'string') return defaultMessages[language][error];
    return language[error];
}

export function normalizeArray<T>(val?: T | T[]) : T[] {
    if(typeof val === 'undefined') return [];
    return Array.isArray(val) ? val : [ val ];
}
