
/**
 * Languages ​​available for issuing standard messages
 */
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

/**
 * Supported types for data input and output
 */
export type FormFieldValue = (
    | string 
    | number 
    | boolean 
    | null 
    | undefined
);

/**
 * Data validation and transformation scheme
 */
export type FormCheckerSchema<Fields extends string = string> = (
    Record<Fields, FormCheckerRules<Fields>>
);

/**
 * Form input data
 */
export type FormCheckerData<Schema extends FormCheckerSchema> = (
    Record<keyof Schema, FormFieldValue>
);

/**
 * Validation rules for a form field
 */
export type FormCheckerRules<
    Fields extends string,
    Input extends FormFieldValue = FormFieldValue,
    Output extends FormFieldValue = Input,
> = {

    /**
     * Validates whether the field is mandatory.
     * If it is blank, you can enter a default output value.
     */
    required : (
        | boolean
        | { default: Output | (() => (Promise<Output> | Output)) }
    );

    /**
     * Validates if it is a number equal to or greater
     * than the one entered
     */
    min ?: number;

    /**
     * Validates whether it is a number equal to
     * or less than the one provided
     */
    max ?: number;

    /**
     * Validates whether the number of characters is
     * equal to or greater than the amount informed
     */
    minLength ?: number;

    /**
     * Validates whether the number of characters is
     * equal to or less than the amount informed
     */
    maxLength ?: number;

    /**
     * Validates whether the field data is exactly
     * the same as another field
     */
    equal ?: Fields;
    
    /**
     * Validates one or more regular expressions
     */
    regexp ?: RegExp | RegExp[];

    /**
     * By default the data is trimmed, if you don't want it,
     * enable untrimmed
     */
    untrimmed ?: boolean;
    
    /**
     * Validates whether a field is true
     */
    checked ?: boolean;

    /**
     * Validates one or more synchronous and asynchronous
     * custom tests
     */
    test ?: (
        | ((value : Input) => Promise<boolean> | boolean)
        | Array<(value : Input) => Promise<boolean> | boolean>
    );

    /**
     * Changes to data before validations
     */
    onBefore ?: (
        | ((value : Input) => Promise<Input> | Input)
        | Array<(value : Input) => Promise<Input> | Input>
    );

    /**
     * Changes to data after validations
     */
    onAfter ?: (
        | ((value : Input) => Promise<Input> | Input)
        | Array<(value : Input) => Promise<Input> | Input>
    );
    
    /**
     * Allows modification and type change in the final data result
     */
    output ?: (value : Input) => Promise<Output> | Output;

    /**
     * Customization of validation error messages
     */
    messages ?: Partial<Record<FormCheckerError, string>>;

}

/**
 * Validation error message customization options
 */
export type FormCheckerError = (
    keyof Omit<FormCheckerRules<string>, (
        | 'output' 
        | 'messages' 
        | 'untrimmed'
        | 'onBefore'
        | 'onAfter'
    )>
);

/**
 * Infer output data type
 */
export type InferResultType<
    Fields extends string, 
    Schema extends FormCheckerSchema<Fields>,
    Data extends FormCheckerData<Schema>
> = {
    [K in keyof Schema]: Schema[K] extends FormCheckerRules<Fields, Data[K], infer Output>
        ? Output
        : never;
};

/**
 * Result of data validation and transformation
 */
export type FormCheckerResult<Fields extends string, Schema extends FormCheckerSchema<Fields>, Data extends FormCheckerData<Schema>> = {
    isValid: boolean;
    messages: Partial<Record<Fields, string>>;
    errors: Partial<Record<Fields, FormCheckerError>>;   
    result: InferResultType<Fields, Schema, Data>;
}
