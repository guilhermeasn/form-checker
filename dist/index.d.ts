import type { FormCheckerData, FormCheckerDefaultMessages, FormCheckerError, FormCheckerLanguages, FormCheckerResult, FormCheckerRules, FormCheckerSchema, FormCheckerValue } from "./types";
export declare function formChecker<Data extends FormCheckerData, Schema extends FormCheckerSchema<Data>>(schema: Schema, data: Data, language?: FormCheckerDefaultMessages | FormCheckerLanguages): Promise<FormCheckerResult<Data>>;
export type { FormCheckerData, FormCheckerDefaultMessages, FormCheckerError, FormCheckerLanguages, FormCheckerResult, FormCheckerRules, FormCheckerSchema, FormCheckerValue };
export default formChecker;
