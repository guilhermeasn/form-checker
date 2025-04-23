import type {
    FormCheckerDefaultMessages,
    FormCheckerLanguages
} from "./types";

/**
 * Internationalized validation error messages
 */
export const defaultMessages: Record<FormCheckerLanguages, FormCheckerDefaultMessages> = {

    // English    
    en: {
        required: 'This field is required.',
        min: 'The value is below the allowed minimum.',
        max: 'The value exceeds the allowed maximum.',
        minLength: 'The value is too short.',
        maxLength: 'The value is too long.',
        equal: 'The values do not match.',
        regexp: 'The format is invalid.',
        test: 'The value did not pass the validation.',
        checked: 'This field is required.',
    },

    // Português
    pt: {
        required: 'O campo é obrigatório.',
        min: 'O valor é menor que o mínimo permitido.',
        max: 'O valor é maior que o máximo permitido.',
        minLength: 'O valor é muito curto.',
        maxLength: 'O valor é muito longo.',
        equal: 'Os valores não coincidem.',
        regexp: 'O formato é inválido.',
        test: 'O valor não passou na validação.',
        checked: 'Este campo é obrigatório.',
    },

    // Español
    es: {
        required: 'Este campo es obligatorio.',
        min: 'El valor es menor que el mínimo permitido.',
        max: 'El valor supera el máximo permitido.',
        minLength: 'El valor es demasiado corto.',
        maxLength: 'El valor es demasiado largo.',
        equal: 'Los valores no coinciden.',
        regexp: 'El formato no es válido.',
        test: 'El valor no pasó la validación.',
        checked: 'Este campo es obligatorio.',
    },

    // Français
    fr: {
        required: 'Ce champ est obligatoire.',
        min: 'La valeur est inférieure au minimum autorisé.',
        max: 'La valeur dépasse le maximum autorisé.',
        minLength: 'La valeur est trop courte.',
        maxLength: 'La valeur est trop longue.',
        equal: 'Les valeurs ne correspondent pas.',
        regexp: 'Le format est invalide.',
        test: 'La valeur n’a pas passé la validation.',
        checked: 'Ce champ est obligatoire.',
    },

    // Deutsch
    de: {
        required: 'Dieses Feld ist erforderlich.',
        min: 'Der Wert liegt unter dem erlaubten Minimum.',
        max: 'Der Wert überschreitet das erlaubte Maximum.',
        minLength: 'Der Wert ist zu kurz.',
        maxLength: 'Der Wert ist zu lang.',
        equal: 'Die Werte stimmen nicht überein.',
        regexp: 'Das Format ist ungültig.',
        test: 'Der Wert hat die Validierung nicht bestanden.',
        checked: 'Dieses Feld ist erforderlich.',
    },

    // Italiano
    it: {
        required: 'Questo campo è obbligatorio.',
        min: 'Il valore è inferiore al minimo consentito.',
        max: 'Il valore supera il massimo consentito.',
        minLength: 'Il valore è troppo corto.',
        maxLength: 'Il valore è troppo lungo.',
        equal: 'I valori non corrispondono.',
        regexp: 'Il formato non è valido.',
        test: 'Il valore non ha superato la convalida.',
        checked: 'Questo campo è obbligatorio.',
    },

    // 中文 (Chinese)
    zh: {
        required: '该字段为必填项。',
        min: '值低于允许的最小值。',
        max: '值超过了允许的最大值。',
        minLength: '值太短。',
        maxLength: '值太长。',
        equal: '两个值不匹配。',
        regexp: '格式无效。',
        test: '值未通过验证。',
        checked: '该字段为必填项。',
    },

    // 日本語 (Japanese)
    ja: {
        required: 'この項目は必須です。',
        min: '値が許容される最小値を下回っています。',
        max: '値が許容される最大値を超えています。',
        minLength: '値が短すぎます。',
        maxLength: '値が長すぎます。',
        equal: '値が一致しません。',
        regexp: '形式が無効です。',
        test: '値が検証に合格しませんでした。',
        checked: 'この項目は必須です。',
    }

};

export default defaultMessages;
