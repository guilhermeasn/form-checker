import { FormCheckerError, FormCheckerResult, FormCheckerRules, FormCheckerSchema } from "./types";

export async function formChecker<Fields extends string>(
    schema : FormCheckerSchema<Fields>,
    data : Record<Fields, any>
) : Promise<FormCheckerResult<Fields>> {

    const result : Partial<Record<Fields, any>> = {};
    const errors : Partial<Record<Fields, FormCheckerError>> = {};
    const mensages: Partial<Record<Fields, string>> = {};

    field: for(let key in schema) {
                
        let value : any = data[key];

        const rules : FormCheckerRules<Fields> = schema[key];

        const onError = (error : FormCheckerError) : true => {
            errors[key] = error;
            mensages[key] = rules.messages?.[error] ?? 'The field was not filled in correctly';
            return true;
        }

        if(rules.required && !value && onError('required')) continue;
        if(rules.min && parseFloat(value) < rules.min && onError('min')) continue;
        if(rules.max && parseFloat(value) > rules.max && onError('max')) continue;
        if(rules.minLength && value.length < rules.minLength && onError('minLength')) continue;
        if(rules.maxLength && value.length > rules.maxLength && onError('maxLength')) continue;
        if(rules.equal && data[rules.equal] !== value && onError('equal')) continue;
        if(rules.test && !(await rules.test(value)) && onError('test')) continue;

        const regexps : RegExp[] = Array.isArray(rules.regexp) ? rules.regexp : rules.regexp ? [rules.regexp] : [];

        for(let regexp of regexps) {
            if(!regexp.test(value) && onError('regexp')) continue field;
        }

        if(rules.transform) value = await rules.transform(value);
        result[key] = value || rules.defaultIfEmpty;

    }

    return Object.keys(errors).length === 0
        ? { isValid: true, result }
        : { isValid: false, mensages, errors };

}

export type { FormCheckerResult, FormCheckerRules, FormCheckerSchema };
export default formChecker;
