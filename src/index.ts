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

export async function formChecker<Data extends FormCheckerData, Schema extends FormCheckerSchema<Data>>(
    schema : FormCheckerSchema<Data>,
    data : Data,
    language : FormCheckerLanguages = 'en'
) : Promise<FormCheckerResult<Data, Schema>> {

    const isEmpty = (value: FormCheckerType) : boolean => value === undefined || value === null || value.toString().trim() === '';
    const isInvalidNumber = (value: string) : boolean => isNaN(parseFloat(value));

    const result : Data = {...data};
    const errors : Partial<Partial<Record<keyof Data, FormCheckerError>>> = {};
    const messages: Partial<Record<keyof Data, string>> = {};

    loop: for(let field in schema) {

        const rules = schema[field];

        if(typeof result[field] === 'string' && !rules.untrimmed) {
            result[field] = result[field].trim() as Data[Extract<keyof Data, string>];
        }

        const onError = (error : FormCheckerError) : true => {
            errors[field] = error;
            messages[field] = rules.messages?.[error] ?? defaultMessages[language][error];
            return true;
        }

        if(rules.required && isEmpty(result[field])) {

            if(typeof rules.required === 'object') {
                result[field] = 'default' in rules.required
                    ? rules.required.default
                    : await rules.required.defaultCallback(result[field]);
            } else {
                onError('required');
                continue loop;
            }

        }
        
        if(rules.checked && !result[field] && onError('checked')) continue loop;
        if(rules.equal && data[rules.equal] !== result[field] && onError('equal')) continue loop;

        if(typeof result[field] === 'string' || typeof result[field] === 'number') {

            const value = result[field].toString().trim();

            if(rules.min && (isInvalidNumber(value) || parseFloat(value) < rules.min) && onError('min')) continue loop;
            if(rules.max && (isInvalidNumber(value) || parseFloat(value) > rules.max) && onError('max')) continue loop;
            if(rules.minLength && value.length < rules.minLength && onError('minLength')) continue loop;
            if(rules.maxLength && value.length > rules.maxLength && onError('maxLength')) continue loop;

            const regs : RegExp[] = Array.isArray(rules.regexp) ? rules.regexp : (rules.regexp ? [rules.regexp] : []);
            for(let r of regs) if(!r.test(value) && onError('regexp')) continue loop;

        }
        
        const tests = Array.isArray(rules.test) ? rules.test : (rules.test ? [rules.test] : []);
        for(let t of tests) if(!(await t(result[field])) && onError('test')) continue loop;

        if(rules.transform) result[field] = await rules.transform(result[field]);

    }

    return {
        isValid: Object.keys(errors).length === 0,
        messages, errors, 
        result: result as unknown as InferResultType<Schema>
    }

}

export type { FormCheckerResult, FormCheckerRules, FormCheckerSchema };
export default formChecker;
