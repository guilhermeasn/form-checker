# FormChecker

[![tests](https://github.com/guilhermeasn/form-checker/actions/workflows/test.yml/badge.svg)](https://github.com/guilhermeasn/form-checker/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/form-checker.svg)](https://www.npmjs.com/package/form-checker/v/latest)
[![downloads](https://img.shields.io/npm/dt/form-checker)](https://www.npmjs.com/package/form-checker/)

A TypeScript library for flexible and customizable form validation with support for synchronous and asynchronous rules.

## Features

- Define validation rules for each form field.
- Supports built-in validation rules such as `required`, `min`, `max`, `minLength`, `maxLength`, `equal`, and `regexp`.
- Supports custom asynchronous validation custom rules (`test`).
- Handles data transformation before validation (`transform`).
- Returns detailed validation results including errors and custom messages.

## Installation

```bash
npm install form-checker-ts
```

## Example Usage

```ts
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

formChecker(schema, data).then(result => {
    console.log(result);
});
```

## Author

* **Guilherme Neves** - [github](https://github.com/guilhermeasn/) - [website](https://gn.dev.br/)

## License

This project is under the MIT license - see the [LICENSE](https://github.com/guilhermeasn/form-checker/blob/master/LICENSE) file for details.
