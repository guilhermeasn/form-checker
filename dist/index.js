"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formChecker = formChecker;
function formChecker(schema, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const isEmpty = (value) => value === undefined || value === null || value === '';
        const isInvalidNumber = (value) => isNaN(parseFloat(value));
        const toString = (value) => typeof (value === null || value === void 0 ? void 0 : value.toString) === 'function' ? value.toString() : '';
        const result = {};
        const errors = {};
        const mensages = {};
        field: for (let key in schema) {
            let value = data[key];
            const rules = schema[key];
            const onError = (error) => {
                var _a, _b;
                errors[key] = error;
                mensages[key] = (_b = (_a = rules.messages) === null || _a === void 0 ? void 0 : _a[error]) !== null && _b !== void 0 ? _b : 'The field was not filled in correctly';
                return true;
            };
            if (rules.required && isEmpty(value) && onError('required'))
                continue;
            if (rules.min && (isInvalidNumber(value) || parseFloat(value) < rules.min) && onError('min'))
                continue;
            if (rules.max && (isInvalidNumber(value) || parseFloat(value) > rules.max) && onError('max'))
                continue;
            if (rules.minLength && toString(value).trim().length < rules.minLength && onError('minLength'))
                continue;
            if (rules.maxLength && toString(value).trim().length > rules.maxLength && onError('maxLength'))
                continue;
            if (rules.equal && data[rules.equal] !== value && onError('equal'))
                continue;
            if (rules.test && !(yield rules.test(value)) && onError('test'))
                continue;
            const regexps = Array.isArray(rules.regexp) ? rules.regexp : rules.regexp ? [rules.regexp] : [];
            for (let regexp of regexps) {
                if (!regexp.test(value) && onError('regexp'))
                    continue field;
            }
            if (rules.transform)
                value = yield rules.transform(value);
            result[key] = isEmpty(value) ? rules.defaultIfEmpty : value;
        }
        return {
            isValid: Object.keys(errors).length === 0,
            mensages, errors, result
        };
    });
}
exports.default = formChecker;
