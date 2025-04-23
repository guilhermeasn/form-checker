// REVISAR

import type {
    FormCheckerData,
    FormCheckerError,
    FormCheckerLanguages,
    FormCheckerResult,
    FormCheckerRules,
    FormCheckerSchema,
    FormCheckerType,
    InferResultType
} from "./types";

import { defaultMessages } from "./errors";

export async function formChecker<Fields extends string, Data extends FormCheckerData<Fields>, Schema extends FormCheckerSchema<Fields>>(
    schema : FormCheckerSchema<Fields>,
    data : Data,
    language : FormCheckerLanguages | Record<FormCheckerError, string> = 'en'
) : Promise<FormCheckerResult<Fields, Data, Schema>> {

    const isEmpty = (value: FormCheckerType) : boolean => value === undefined || value === null || value.toString().trim() === '';
    const isInvalidNumber = (value: string) : boolean => isNaN(parseFloat(value));

    const getDefaultMessages = (error : FormCheckerError) : string => {
        if(typeof language === 'string') return defaultMessages[language][error];
        return language[error];
    }

    const result = {} as InferResultType<Fields, Schema>;
    const errors : Partial<Partial<Record<keyof Data, FormCheckerError>>> = {};
    const messages: Partial<Record<keyof Data, string>> = {};

    loop: for(let field in schema) {

        const rules = schema[field];
        let value = data[field];

        if(typeof value === 'string' && !rules.untrimmed) {
            value = value.trim() as Data[Extract<Fields, string>];
        }

        const onError = (error : FormCheckerError) : true => {
            errors[field] = error;
            messages[field] = rules.messages?.[error] ?? getDefaultMessages(error);
            return true;
        }

        if(rules.required && isEmpty(value)) {

            if(typeof rules.required === 'object') (result as any)[field] = (
                'default' in rules.required
                    ? rules.required.default
                    : await rules.required.defaultCallback(value)
                );

            else onError('required');

            continue loop;

        }
        
        if(rules.checked && !value && onError('checked')) continue loop;
        if(rules.equal && data[rules.equal] !== value && onError('equal')) continue loop;

        if(typeof value === 'string' || typeof value === 'number') {

            const valueString = value.toString().trim();

            if(rules.min && (isInvalidNumber(valueString) || parseFloat(valueString) < rules.min) && onError('min')) continue loop;
            if(rules.max && (isInvalidNumber(valueString) || parseFloat(valueString) > rules.max) && onError('max')) continue loop;
            if(rules.minLength && valueString.length < rules.minLength && onError('minLength')) continue loop;
            if(rules.maxLength && valueString.length > rules.maxLength && onError('maxLength')) continue loop;

            const regs : RegExp[] = Array.isArray(rules.regexp) ? rules.regexp : (rules.regexp ? [rules.regexp] : []);
            for(let r of regs) if(!r.test(valueString) && onError('regexp')) continue loop;

        }
        
        const tests = Array.isArray(rules.test) ? rules.test : (rules.test ? [rules.test] : []);
        for(let t of tests) if(!(await t(value)) && onError('test')) continue loop;

        if(rules.transform) value = await rules.transform(value) as Data[Extract<Fields, string>];

        (result as any)[field] = value;

    }

    return {
        isValid: Object.keys(errors).length === 0,
        messages, errors, result
    }

}

export type { FormCheckerResult, FormCheckerRules, FormCheckerSchema };
export default formChecker;
