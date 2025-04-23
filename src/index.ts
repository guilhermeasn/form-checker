import { formChecker, type FormCheckerSchema } from 'form-checker-ts';

type Data = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
};

const schema : FormCheckerSchema<Data> = {
    name: { required: true, minLength: 3, maxLength: 30 },
    email: { required: true, minLength: 5, maxLength: 50 },
    password: { required: true, minLength: 6, maxLength: 20, regexp: [/[a-z]/, /[A-Z]/, /[0-9]/] },
    password_confirm: { required: { ifFilled: 'password' }, equal: 'password' }
};

const data : Data = {
    name: 'Guilherme',
    email: 'contato@gn.dev.br',
    password: 'Q1w2E3r4',
    password_confirm: 'Q1w2E3r4'
};

console.log(' ----- FormChecker Example Start ----- ');

formChecker(schema, data, 'pt').then(result => {
    console.log(result);
});

console.log(' ----- FormChecker Example End ----- ');
