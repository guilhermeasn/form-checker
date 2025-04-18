import { formChecker, type FormCheckerSchema } from '../src/';

describe('formChecker', () => {

    const schema: FormCheckerSchema<'email' | 'password' | 'confirmPassword'> = {
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
            },
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
        expect(result.mensages).toEqual({});
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
        expect(result.mensages.email).toBe('Email is required');
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
        expect(result.mensages.password).toBe('Password must be at least 6 characters');
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
        expect(result.mensages.confirmPassword).toBe('Confirm Password must match Password');
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
        expect(result.mensages.email).toBe('Email is invalid');
    });

    test('test readme example', () => {

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
            expect(result.isValid).toBe(true);
        });

    })

});
