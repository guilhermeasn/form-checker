import type { FormCheckerData, FormCheckerDefaultMessages, FormCheckerError, FormCheckerLanguages, FormCheckerResult, FormCheckerRuleRequired, FormCheckerRules, FormCheckerSchema, FormCheckerValue } from "./types";
/**
 * Form data validator
 */
export declare function formChecker<Data extends FormCheckerData, Schema extends FormCheckerSchema<Data>>(schema: Schema, data: Data, language?: FormCheckerDefaultMessages | FormCheckerLanguages): Promise<FormCheckerResult<Data>>;
export type { FormCheckerData, FormCheckerDefaultMessages, FormCheckerError, FormCheckerLanguages, FormCheckerResult, FormCheckerRuleRequired, FormCheckerRules, FormCheckerSchema, FormCheckerValue };
export default formChecker;
