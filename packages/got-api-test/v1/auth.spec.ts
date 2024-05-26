import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { createApi, type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { env } from '../env';

let testId: string;
let api: GotApi;
// let userEmail: string;
let invalidReq: Promise<unknown>;
beforeAll(async () => {
    api = createApi({
        host: env.GOT_API_URL,
        adminMode: false,
        sessionExpireTime: 1000 * 60 * 5,
    });
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
    // userEmail = `info+${testId}@${env.BASE_DOMAIN}`;
});

describe('register', () => {
    describe('given a valid email address', () => {
        const email = `info+${testId}@${env.BASE_DOMAIN}`;
        const invalidPasswords = [['tee2eee'], ['teeeeeee']];

        describe.each(invalidPasswords)(`and an invalid password`, (password: string) => {
            beforeEach(async () => {
                invalidReq = api.registerInit({ email, password });
            });
            it('throws InvalidPasswordError', async () => {
                return expect(invalidReq).rejects.toThrow({
                    name: 'InvalidPasswordError',
                    message: 'The password must contain at least 8 characters and at least 1 number.',
                });
            });
        });
    });

    describe('given a valid password', () => {
        const password = `${testId}-pw-1`;
        const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];

        describe.each(invalidEmails)('and an invalid email address', (email: string) => {
            beforeEach(async () => {
                invalidReq = api.registerInit({ email, password });
            });
            it('throws InvalidEmailError', async () => {
                return expect(invalidReq).rejects.toThrow({
                    name: 'InvalidEmailError',
                    message: 'The email must be valid and must not contain upper case letters or spaces.',
                });
            });
        });
    });

    describe('given an existing user', () => {
        const email = env.TEST_USER_1_EMAIL;
        const password = `${testId}-pw-1`;

        beforeEach(async () => {
            invalidReq = api.registerInit({ email, password });
        });
        it('throws UserAlreadyExistsError', async () => {
            return expect(invalidReq).rejects.toThrow({
                name: 'UserExistsError',
                message: 'There is an existing user with the given email address.',
            });
        });
    });

    describe.only('given valid credentials', () => {
        const email = `info+${testId}@${env.BASE_DOMAIN}`;
        const password = `${testId}-pw-1`;
        let registerInitRequest: unknown;

        beforeAll(async () => {
            registerInitRequest = await api.registerInit({ email, password });
        });

        describe('response', () => {
            it('resolves with success message', async () => {
                return expect(registerInitRequest).resolves.toEqual({
                    message: 'User was created. Check email for verification.',
                });
            });
        });

        describe('given the user receives the verification email', () => {
            beforeAll(async () => {
                invalidReq = api.registerVerify({ email, password });
            });

            it('resolves with success message', async () => {
                return expect(invalidReq).resolves.toEqual({
                    message: 'User was verified.',
                });
            });
        });
    });
});
