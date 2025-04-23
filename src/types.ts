export type FormCheckerLanguages = (
    | 'en' // English
    | 'pt' // Português
    | 'es' // Español
    | 'fr' // Français
    | 'de' // Deutsch
    | 'it' // Italiano
    | 'zh' // 中文 (Chinese)
    | 'ja' // 日本語 (Japanese)
);

export type FormCheckerType = string | number | boolean | null | undefined;
export type FormCheckerData = Record<string, FormCheckerType>;

export type FormCheckerRules<
    Fields extends string,
    Input extends FormCheckerType,
    Output extends FormCheckerType = Input,
> = {

    required : (
        | boolean
        | { default: Output }
        | { defaultCallback: (value : Output) => (Promise<Output> | Output) }
    );

    min ?: number;
    max ?: number;

    minLength ?: number;
    maxLength ?: number;

    equal ?: Fields;
    
    regexp ?: RegExp | RegExp[];

    untrimmed ?: boolean;
    
    checked ?: boolean;

    test ?: (
        | ((value : Input) => Promise<boolean> | boolean)
        | Array<(value : Input) => Promise<boolean> | boolean>
    );
    
    transform ?: (value : Input) => Promise<Output> | Output;

    messages ?: Partial<Record<FormCheckerError, string>>;

}

export type InferResultType<Schema extends FormCheckerSchema<any>> = {
    [K in keyof Schema]: Schema[K] extends FormCheckerRules<any, any, infer Output>
        ? Output
        : never;
};

export type FormCheckerError = keyof Omit<FormCheckerRules<any, any>, 'transform' | 'messages' | 'untrimmed'>;

export type FormCheckerSchema<Data extends FormCheckerData> = {
    [k in keyof Data]: FormCheckerRules<keyof Data & string, Data[k]>
}

export type FormCheckerResult<Data extends FormCheckerData, Schema extends FormCheckerSchema<Data>> = {
    isValid: boolean;
    messages: Partial<Record<keyof Data, string>>;
    errors: Partial<Record<keyof Data, FormCheckerError>>;   
    result: InferResultType<Schema>;
}
