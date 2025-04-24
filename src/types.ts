
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
 * Set of standard validation error messages
 */
export type FormCheckerDefaultMessages = (
    Record<FormCheckerError, string>
);

/**
 * Supported types for data input and output
 */
export type FormCheckerValue = (
    | string 
    | number 
    | boolean 
    | null 
    | undefined
);

/**
 * Form input data
 */
export type FormCheckerData = (
    Record<string, FormCheckerValue>
);

/**
 * Get the form fields
 */
export type FormCheckerFields<Data extends FormCheckerData> = (
    Extract<keyof Data, string>
);

/**
 * Data validation and transformation scheme
 */
export type FormCheckerSchema<Data extends FormCheckerData> = {
    [K in keyof Data]: FormCheckerRules<FormCheckerFields<Data>, Data[K]>;
};

/**
 * Validates whether the field is mandatory.
 * If it is blank, you can enter a default output value.
 * Or you can make it mandatory whether other fields are filled in or not.
 */
export type FormCheckerRuleRequired<
    Fields extends string,
    Type extends FormCheckerValue
> = (
    | boolean
    | { default: Type | (() => (Promise<Type> | Type)) }
    | { ifFilled ?: Fields | Fields[], ifNotFilled ?: Fields | Fields[] }
);

/**
 * Validation rules for a form field
 */
export type FormCheckerRules<
    Fields extends string,
    Type extends FormCheckerValue
> = {

    /**
     * By default the data is trimmed, if you don't want it,
     * enable untrimmed
     */
    untrimmed ?: boolean;

    /**
     * Validates whether the field is mandatory.
     * If it is blank, you can enter a default output value.
     * Or you can make it mandatory whether other fields are filled in or not.
     */
    required : FormCheckerRuleRequired<Fields, Type>;

    /**
     * Changes to data before validations
     */
    onBefore ?: (
        | ((value : Type) => Promise<Type> | Type)
        | Array<(value : Type) => Promise<Type> | Type>
    );

    /**
     * Validates whether a field is true
     */
    checked ?: boolean;

    /**
     * Validates whether the field data is exactly
     * the same as another field
     */
    equal ?: Fields;

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
     * Validates one or more regular expressions
     */
    regexp ?: RegExp | RegExp[];

    /**
     * Validates one or more custom tests, synchronous and asynchronous,
     * and can return a boolean or a string with the validation error message
     */
    test ?: (
        | ((value : Type) => Promise<boolean | string> | boolean | string)
        | Array<(value : Type) => Promise<boolean | string> | boolean | string>
    );

    /**
     * Changes to data after validations
     */
    onAfter ?: (
        | ((value : Type) => Promise<Type> | Type)
        | Array<(value : Type) => Promise<Type> | Type>
    );

    /**
     * Customization of validation error messages
     */
    messages ?: Partial<Record<FormCheckerError, string>>;

}

/**
 * Validation error message customization options
 */
export type FormCheckerError = (
    keyof Omit<FormCheckerRules<string, FormCheckerValue>, (
        | 'messages' 
        | 'untrimmed'
        | 'onBefore'
        | 'onAfter'
    )>
);

/**
 * Result of data validation and transformation
 */
export type FormCheckerResult<Data extends FormCheckerData> = {
    isValid: boolean;
    messages: Partial<Record<FormCheckerFields<Data>, string>>;
    errors: Partial<Record<FormCheckerFields<Data>, FormCheckerError>>;   
    result: Data;
}
