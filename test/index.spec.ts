// EXEMPLE:

// const form : FormCheckerSchema<'name' | 'email' | 'password' | 'password_confirm'> = {
//     name: { required: true, min: 3, max: 30 },
//     email: { required: true, min: 5, max: 50 },
//     password: { required: true, min: 6, max: 20, regexp: [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/] },
//     password_confirm: { required: true, equal: 'password' }
// };