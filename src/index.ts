import { formChecker, type FormCheckerSchema } from 'form-checker-ts';

type FormFields = 'name' | 'email' | 'password' | 'password_confirm';

const schema : FormCheckerSchema<FormFields> = {
    name: { required: true, minLength: 3, maxLength: 30 },
    email: { required: true, minLength: 5, maxLength: 50 },
    password: { required: true, minLength: 6, maxLength: 20, regexp: [/[a-z]/, /[A-Z]/, /[0-9]/] },
    password_confirm: { required: true, equal: 'password' }
};

const data : Record<FormFields, string> = {
    name: 'Guilherme',
    email: 'contato@gn.dev.br',
    password: 'Q1w2E3r4',
    password_confirm: 'Q1w2E3r4'
};

console.log(' ----- FormChecker Example Start ----- ');

formChecker(schema, data).then(result => {
    console.log(result);
});

console.log(' ----- FormChecker Example End ----- ');
