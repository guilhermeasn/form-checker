import { FormCheckerError, FormCheckerResult, FormCheckerRules, FormCheckerSchema } from "./types";

export async function formChecker<Fields extends string>(
    schema : FormCheckerSchema<Fields>,
    data : Record<Fields, any>
) : Promise<FormCheckerResult<Fields>> {

    const isEmpty = (value: any) : boolean => value === undefined || value === null || value === '';
    const isInvalidNumber = (value: any) : boolean => isNaN(parseFloat(value));
    const toString = (value: any) : string => typeof value?.toString === 'function' ? value.toString() : '';

    const result : Partial<Record<Fields, any>> = {};
    const errors : Partial<Record<Fields, FormCheckerError>> = {};
    const mensages: Partial<Record<Fields, string>> = {};

    field: for(let key in schema) {
                
        let value : any = data[key];
        result[key] = value;

        const rules : FormCheckerRules<Fields> = schema[key];

        const onError = (error : FormCheckerError) : true => {
            errors[key] = error;
            mensages[key] = rules.messages?.[error] ?? 'The field was not filled in correctly';
            return true;
        }

        if(rules.required && isEmpty(value) && onError('required')) continue;
        if(rules.min && (isInvalidNumber(value) || parseFloat(value) < rules.min) && onError('min')) continue;
        if(rules.max && (isInvalidNumber(value) || parseFloat(value) > rules.max) && onError('max')) continue;
        if(rules.minLength && toString(value).trim().length < rules.minLength && onError('minLength')) continue;
        if(rules.maxLength && toString(value).trim().length > rules.maxLength && onError('maxLength')) continue;
        if(rules.equal && data[rules.equal] !== value && onError('equal')) continue;
        if(rules.test && !(await rules.test(value)) && onError('test')) continue;

        const regexps : RegExp[] = Array.isArray(rules.regexp) ? rules.regexp : rules.regexp ? [rules.regexp] : [];

        for(let regexp of regexps) {
            if(!regexp.test(value) && onError('regexp')) continue field;
        }

        if(rules.transform) value = await rules.transform(value);
        result[key] = isEmpty(value) ? rules.defaultIfEmpty : value;

    }

    return {
        isValid: Object.keys(errors).length === 0,
        mensages, errors, result
    }

}

export type { FormCheckerResult, FormCheckerRules, FormCheckerSchema };
export default formChecker;
