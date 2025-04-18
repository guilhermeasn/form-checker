export type FormCheckerRules<Fields extends string> = {
    required: boolean;
    defaultIfEmpty?: any;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    equal?: Fields;
    test?: (value: any) => (Promise<boolean> | boolean);
    regexp?: RegExp | RegExp[];
    transform?: (value: any) => (Promise<any> | any);
    messages?: Partial<Record<keyof FormCheckerRules<Fields>, string>>;
};
export type FormCheckerError = keyof Omit<FormCheckerRules<any>, 'transform' | 'messages' | 'defaultIfEmpty'>;
export type FormCheckerSchema<Fields extends string> = Record<Fields, FormCheckerRules<Fields>>;
export type FormCheckerResult<Fields extends string> = {
    isValid: boolean;
    mensages: Partial<Record<Fields, string>>;
    errors: Partial<Record<Fields, FormCheckerError>>;
    result: Partial<Record<Fields, any>>;
};
