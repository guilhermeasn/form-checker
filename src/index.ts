import type {
    FormCheckerData,
    FormCheckerDefaultMessages,
    FormCheckerError,
    FormCheckerInferResultType,
    FormCheckerLanguages,
    FormCheckerResult,
    FormCheckerRules,
    FormCheckerSchema,
    FormFieldValue
} from "./types";

import { defaultMessages } from "./errors";

export async function formChecker<
    Fields extends string,
    Schema extends FormCheckerSchema<Fields>,
    Data extends FormCheckerData<Schema>
>(
    schema :Schema,
    data : Data,
    language : FormCheckerDefaultMessages | FormCheckerLanguages = 'en'
) : Promise<FormCheckerResult<Fields, Schema, Data>> {

    const isEmpty = (value: FormFieldValue) : boolean => value === undefined || value === null || value.toString().trim() === '';
    const isInvalidNumber = (value: string) : boolean => isNaN(parseFloat(value));
    const isNotEqual = <T>(a: T, b: unknown): b is T => a !== b;

    const getDefaultMessage = (error : FormCheckerError) : string => {
        if(typeof language === 'string') return defaultMessages[language][error];
        return language[error];
    }

    const result : Partial<Record<keyof Schema, unknown>> = {};
    const errors : Partial<Record<keyof Schema, FormCheckerError>> = {};
    const messages: Partial<Record<keyof Schema, string>> = {};

    loop: for(let field in schema) {

        const rules = schema[field];
        let value = data[field];

        // trimmed
        if(typeof value === 'string' && !rules.untrimmed) {
            value = value.trim() as Data[Extract<Fields, string>];
        }

        const onError = (error : FormCheckerError) : true => {
            errors[field] = error;
            messages[field] = rules.messages?.[error] ?? getDefaultMessage(error);
            return true;
        }

        // required
        if(rules.required && isEmpty(value)) {

            if(typeof rules.required === 'object') {

                result[field] = typeof rules.required.default === 'function'
                    ? await rules.required.default()
                    : rules.required.default;

            } else onError('required');

            continue loop;

        }

        //onBefore
        if(rules.onBefore) {
            const funcs = Array.isArray(rules.onBefore) ? rules.onBefore : [ rules.onBefore ];
            for(let f of funcs) value = await f(value) as Data[Extract<Fields, string>];
        }
        
        // checked
        if(rules.checked && !value && onError('checked')) continue loop;

        // equal
        if(rules.equal && isNotEqual(data[rules.equal], value) && onError('equal')) continue loop;

        // min, max, minLength, maxLength, regexp
        if(typeof value === 'string' || typeof value === 'number') {

            const valueString = value.toString().trim();

            // min, max, minLength, maxLength
            if(rules.min && (isInvalidNumber(valueString) || parseFloat(valueString) < rules.min) && onError('min')) continue loop;
            if(rules.max && (isInvalidNumber(valueString) || parseFloat(valueString) > rules.max) && onError('max')) continue loop;
            if(rules.minLength && valueString.length < rules.minLength && onError('minLength')) continue loop;
            if(rules.maxLength && valueString.length > rules.maxLength && onError('maxLength')) continue loop;

            // regexp
            if(rules.regexp) {
                const regs : RegExp[] = Array.isArray(rules.regexp) ? rules.regexp : [ rules.regexp ];
                for(let r of regs) if(!r.test(valueString) && onError('regexp')) continue loop;
            }

        }
        
        // test
        if(rules.test) {
            const tests = Array.isArray(rules.test) ? rules.test : [ rules.test ];
            for(let t of tests) if(!(await t(value)) && onError('test')) continue loop;
        }

        //onAfter
        if(rules.onAfter) {
            const funcs = Array.isArray(rules.onAfter) ? rules.onAfter : [ rules.onAfter ];
            for(let f of funcs) value = await f(value) as Data[Extract<Fields, string>];
        }

        // output
        result[field] = rules.output ? await rules.output(value) : value;

    }

    return {
        isValid: Object.keys(errors).length === 0,
        messages, errors,
        result: result as FormCheckerInferResultType<Fields, Schema, Data>
    }

}

export type {
    FormCheckerData,
    FormCheckerDefaultMessages,
    FormCheckerError,
    FormCheckerInferResultType,
    FormCheckerLanguages,
    FormCheckerResult,
    FormCheckerRules,
    FormCheckerSchema,
    FormFieldValue
};

export default formChecker;
