import { formChecker, type FormCheckerSchema } from '../src/';

describe('singup form with form-checker', () => {

    type Data = {
        email: string;
        password: string;
        confirmPassword: string;
    };

    const schema : FormCheckerSchema<Data> = {
        email: {
            required: true,
            regexp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            messages: {
                required: 'Email is required',
                regexp: 'Email is invalid',
            },
        },
        password: {
            required: true,
            minLength: 6,
            messages: {
                required: 'Password is required',
                minLength: 'Password must be at least 6 characters',
            },
        },
        confirmPassword: {
            required: true,
            equal: 'password',
            messages: {
                required: 'Confirm Password is required',
                equal: 'Confirm Password must match Password',
            }
        },
    };

    test('valid data should pass validation', async () => {
        const data = {
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        };

        const result = await formChecker(schema, data);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
        expect(result.messages).toEqual({});
    });

    test('required field should fail validation if missing', async () => {
        const data = {
            email: '',
            password: 'password123',
            confirmPassword: 'password123',
        };

        const result = await formChecker(schema, data);
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBe('required');
        expect(result.messages.email).toBe('Email is required');
    });

    test('minLength validation should fail if password is too short', async () => {
            const data = {
            email: 'test@example.com',
            password: 'pass',
            confirmPassword: 'pass',
        };

        const result = await formChecker(schema, data);
        expect(result.isValid).toBe(false);
        expect(result.errors.password).toBe('minLength');
        expect(result.messages.password).toBe('Password must be at least 6 characters');
    });

    test('equal validation should fail if confirmPassword does not match password', async () => {
        const data = {
            email: 'test@example.com',
            password: 'password123',
            confirmPassword: 'wrongpassword',
        };

        const result = await formChecker(schema, data);
        expect(result.isValid).toBe(false);
        expect(result.errors.confirmPassword).toBe('equal');
        expect(result.messages.confirmPassword).toBe('Confirm Password must match Password');
    });

    test('regexp validation should fail if email is invalid', async () => {
        const data = {
            email: 'invalidemail',
            password: 'password123',
            confirmPassword: 'password123',
        };

        const result = await formChecker(schema, data);
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBe('regexp');
        expect(result.messages.email).toBe('Email is invalid');
    });

    test('test readme example', () => {

        type Data = {
            name: string;
            email: string;
            age?: number | null;
            password: string;
            password_confirm: string;
        };
        
        async function emailIsAvailable(email : string) : Promise<boolean> {
            // implementation of the email evaluation function. May include asynchronous access to API
            return true;
        }
        
        const schema : FormCheckerSchema<Data> = {
            name: { required: true, minLength: 3, maxLength: 30 },
            email: { required: true, minLength: 5, maxLength: 50, test: emailIsAvailable },
            age: { required: { default: null }, min: 3, max: 120 },
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
            expect(result.isValid).toBe(true);
        });

    })

});

describe('types validations', () => {

    type Data = {
        name: string;
        age: string;
        confirmPassword: string;
        password: string;
        email: string;
        accept: boolean;
      };
    
      const schema: FormCheckerSchema<Data> = {
        name: { required: true, minLength: 3 },
        age: { required: true, min: 18, max: 60 },
        password: { required: true, minLength: 6 },
        confirmPassword: { required: true, equal: 'password' },
        email: { required: true, regexp: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/ },
        accept: { required: false, checked: true },
      };
    
      it('should validate a correct form', async () => {
        const data = {
          name: 'Alice',
          age: '30',
          password: '123456',
          confirmPassword: '123456',
          email: 'alice@example.com',
          accept: true,
        };
    
        const result = await formChecker(schema, data, 'en');
    
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual({});
        expect(result.messages).toEqual({});
        expect(result.result).toEqual(data);
      });
    
      it('should detect required field error', async () => {
        const data = {
          name: '',
          age: '',
          password: '',
          confirmPassword: '',
          email: '',
          accept: false,
        };
    
        const result = await formChecker(schema, data, 'en');
    
        expect(result.isValid).toBe(false);
        expect(result.errors.name).toBe('required');
        expect(result.errors.age).toBe('required');
        expect(result.errors.password).toBe('required');
        expect(result.errors.confirmPassword).toBe('required');
        expect(result.errors.email).toBe('required');
        expect(result.errors.accept).toBe('checked');
      });
    
      it('should validate numeric range and minLength', async () => {
        const data = {
          name: 'Al',
          age: '17',
          password: '123',
          confirmPassword: '123',
          email: 'alice@example.com',
          accept: true,
        };
    
        const result = await formChecker(schema, data, 'en');
    
        expect(result.isValid).toBe(false);
        expect(result.errors.name).toBe('minLength');
        expect(result.errors.age).toBe('min');
        expect(result.errors.password).toBe('minLength');
      });
    
      it('should detect unequal passwords', async () => {
        const data = {
          name: 'Alice',
          age: '25',
          password: '123456',
          confirmPassword: '654321',
          email: 'alice@example.com',
          accept: true,
        };
    
        const result = await formChecker(schema, data, 'en');
        expect(result.isValid).toBe(false);
        expect(result.errors.confirmPassword).toBe('equal');
      });
    
      it('should detect invalid email format', async () => {
        const data = {
          name: 'Alice',
          age: '25',
          password: '123456',
          confirmPassword: '123456',
          email: 'invalid-email',
          accept: true,
        };
    
        const result = await formChecker(schema, data, 'en');
        expect(result.isValid).toBe(false);
        expect(result.errors.email).toBe('regexp');
      });
    
      it('should return messages in Portuguese', async () => {
        const data = {
          name: '',
          age: '',
          password: '',
          confirmPassword: '',
          email: '',
          accept: false,
        };
    
        const result = await formChecker(schema, data, 'pt');
        expect(result.isValid).toBe(false);
        expect(result.messages.name).toBe('O campo é obrigatório.');
        expect(result.messages.accept).toBe('Este campo é obrigatório.');
      });

});

describe('asyncronous validations', () => {

    it('should validate async test and output transformations', async () => {

        const schema : FormCheckerSchema<{ email: string }> = {
          email: {
            required: true,
            regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            onBefore: async v => v.toLowerCase(),
            test: async (v: string) => v.includes('@example.com'),
            onAfter: async (v: string) => `User: ${v}`
          }
        };
    
        const data = {
          email: 'Test@EXAMPLE.com'
        };
    
        const result = await formChecker(schema, data);
    
        expect(result.isValid).toBe(true);
        expect(result.errors.email).toBeUndefined();
        expect(result.result.email).toBe('User: test@example.com');
      });
    
      it('should fail on missing required field', async () => {
        const schema = {
          name: {
            required: true
          }
        };
    
        const data = {
          name: ''
        };
    
        const result = await formChecker(schema, data);
    
        expect(result.isValid).toBe(false);
        expect(result.errors.name).toBe('required');

      });
    
      it('should apply default async value when required and missing', async () => {

        type Data = {
            age?: number | null;
        };

        const schema : FormCheckerSchema<Data> = {
          age: {
            required: {
              default: async () => 18
            }
          }
        };
    
        const data : Data = {
          age: undefined
        };
    
        const result = await formChecker(schema, data);
    
        expect(result.isValid).toBe(true);
        expect(result.result.age).toBe(18);
      });
    

});

describe('form-checker required rule', () => {

    it('should error when required is true and value is empty', async () => {
        const result = await formChecker(
            { name: { required: true } },
            { name: '' }
        );
        expect(result.isValid).toBe(false);
        expect(result.errors.name).toBe('required');
    });

    it('should use default value if required.default is provided', async () => {
        type Data = { age: number | null };
        const result = await formChecker<Data, FormCheckerSchema<Data>>(
            { age: { required: { default: 30 } } },
            { age: null }
        );
        expect(result.isValid).toBe(true);
        expect(result.result.age).toBe(30);
    });

    it('should use default function value if required.default is a function', async () => {
        const result = await formChecker(
            { token: { required: { default: async () => 'generated' } } },
            { token: '' }
        );
        expect(result.isValid).toBe(true);
        expect(result.result.token).toBe('generated');
    });

    it('should require if another field is filled (ifFilled)', async () => {
        const result = await formChecker(
            {
                a: { required: true },
                b: { required: { ifFilled: 'a' } }
            },
            { a: 'filled', b: '' }
        );
        expect(result.isValid).toBe(false);
        expect(result.errors.b).toBe('required');
    });

    it('should require if another field is NOT filled (ifNotFilled)', async () => {
        const result = await formChecker(
            {
                a: { required: true },
                b: { required: { ifNotFilled: 'a' } }
            },
            { a: '', b: '' }
        );
        expect(result.isValid).toBe(false);
        expect(result.errors.b).toBe('required');
    });

    it('should skip required if related field is filled (ifNotFilled)', async () => {
        const result = await formChecker(
            {
                a: { required: true },
                b: { required: { ifNotFilled: 'a' } }
            },
            { a: 'exists', b: '' }
        );
        expect(result.isValid).toBe(true);
    });

});

describe('form-checker test error message', () => {

    type Data = { field: string; }
    const data : Data = { field: 'err' };

    it('message error default', () => {

        const schema : FormCheckerSchema<Data> = {
            field: { required: true, test: () => false }
        }

        formChecker(schema, data).then(result => {
            expect(result.isValid).toBe(false);
            expect(result.messages.field).toBe('The value did not pass the validation.');
        });

    });

    it('message error global custom', () => {

        const schema : FormCheckerSchema<Data> = {
            field: { required: true, test: () => false, messages: { test: 'invalid message out test' } }
        }

        formChecker(schema, data).then(result => {
            expect(result.isValid).toBe(false);
            expect(result.messages.field).toBe('invalid message out test');
        });

    });

    it('message error built-in custom', () => {

        const schema : FormCheckerSchema<Data> = {
            field: { required: true, test: () => 'invalid field in test', messages: { test: 'invalid message out test' } }
        }

        formChecker(schema, data).then(result => {
            expect(result.isValid).toBe(false);
            expect(result.messages.field).toBe('invalid field in test');
        });

    });
    
});