import type { FormCheckerDefaultMessages, FormCheckerError, FormCheckerLanguages, FormCheckerValue } from "./types";
export declare function isEmpty(value: FormCheckerValue): boolean;
export declare function isInvalidNumber(value: string): boolean;
export declare function isSameType<T>(a: T, b: unknown): b is T;
export declare function isNotEqual(a: unknown, b: unknown): boolean;
export declare function getDefaultMessage(error: FormCheckerError, language: FormCheckerDefaultMessages | FormCheckerLanguages): string;
export declare function normalizeArray<T>(val?: T | T[]): T[];
