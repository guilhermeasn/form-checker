<!-- update -->

# FormChecker

[![tests](https://github.com/guilhermeasn/form-checker/actions/workflows/test.yml/badge.svg)](https://github.com/guilhermeasn/form-checker/actions/workflows/test.yml)
[![npm](https://img.shields.io/npm/v/form-checker-ts.svg)](https://www.npmjs.com/package/form-checker-ts/v/latest)
[![downloads](https://img.shields.io/npm/dt/form-checker-ts)](https://www.npmjs.com/package/form-checker-ts/)

A TypeScript library for flexible and customizable form validation with support for synchronous and asynchronous rules.

## Features

- Define validation rules for each form field.
- Supports built-in validation rules such as `required`, `checked`, `min`, `max`, `minLength`, `maxLength`, `equal`, and `regexp`.
- Supports custom asynchronous validation rules (`test`).
- Handles data transformation before and after validation (`onBefore`, `onAfter`).
- Returns detailed validation results including errors and custom or default messages.
- Contains standard validation error messages in several languages ​​such as: English, Portuguese, Spanish, Chinese, etc.

## Installation

With NPM:

```bash
npm install form-checker-ts
```

Or with Yarn:

```bash
yarn add form-checker-ts
```

## Example Usage

```ts
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

formChecker(schema, data, 'pt').then(result => {
    console.log(result);
});
```

## Author

* **Guilherme Neves** - [github](https://github.com/guilhermeasn/) - [website](https://gn.dev.br/)

## License

This project is under the MIT license - see the [LICENSE](https://github.com/guilhermeasn/form-checker/blob/master/LICENSE) file for details.
