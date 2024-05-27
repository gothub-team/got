import { describe, beforeAll, it, expect } from 'bun:test';
import { createApi, type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { env } from '../env';
import { createMailClient } from './shared/mail';

export const match6Digits = (str: string) => str.match(/[0-9]{6}/)?.[0];

let testId: string;
let api: GotApi;
let mailClient: ReturnType<typeof createMailClient>;
beforeAll(async () => {
    api = createApi({
        host: env.GOT_API_URL,
        adminMode: false,
        sessionExpireTime: 1000 * 60 * 5,
    });
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});

describe('auth flows', () => {
    describe('given valid credentials', () => {
        let email: string;
        let password: string;
        beforeAll(() => {
            email = `info+${testId}@${env.BASE_DOMAIN}`;
            password = `${testId}-pw-1`;
        });

        describe('response', () => {
            it('resolves with success message', async () => {
                return expect(api.registerInit({ email, password })).resolves.toEqual({
                    message: 'User was created. Check email for verification.',
                });
            });
        });

        describe('verification mail', () => {
            let email: string;
            let verificationCode: string;
            beforeAll(async () => {
                email = `info+${testId}@${env.BASE_DOMAIN}`;
                mailClient = createMailClient({
                    host: env.MAIL_IMAP_SERVER,
                    port: 993,
                    user: env.MAIL_USERNAME,
                    pass: env.MAIL_USER_PW,
                    mailbox: 'Inbox',
                });
                await mailClient.init();
            });

            describe('default', async () => {
                it('receives verification code', async () => {
                    console.log('waiting for mail');
                    const verificationMail = await mailClient.receiveMailTo(email);
                    verificationCode = match6Digits(verificationMail) ?? '';
                    expect(verificationCode).toHaveLength(6);
                });
            });

            describe('register verify', () => {
                describe('response', () => {
                    it('resolves with success message', async () => {
                        return expect(api.registerVerify({ email, verificationCode })).resolves.toEqual({
                            message: 'Success.',
                        });
                    });
                });

                describe('login', () => {
                    describe('response', () => {
                        it('resolves', async () => {
                            return expect(api.login({ email, password })).resolves.toBeUndefined();
                        });
                    });
                });
            });
        });
    });
});

describe.only('error handling', () => {
    describe('registerInit', () => {
        describe('given a valid email address', () => {
            const email = `info+test-1@${env.BASE_DOMAIN}`;
            const invalidPasswords = [['tee2eee'], ['teeeeeee']];
            describe.each(invalidPasswords)(`and an invalid password`, (password: string) => {
                it('throws InvalidPasswordError', async () => {
                    return expect(api.registerInit({ email, password })).rejects.toThrow({
                        name: 'InvalidPasswordError',
                        message: 'The password must contain at least 8 characters and at least 1 number.',
                    });
                });
            });
        });

        describe('given a valid password', () => {
            const password = `test-1-pw-1`;
            const invalidEmails = [
                [''],
                ['Tes.T@test.com'],
                ['tes.t@tesT.com'],
                [' tes.t@test.com'],
                ['tes.t@test.com '],
            ];
            describe.each(invalidEmails)('and an invalid email address', (email: string) => {
                it('throws InvalidEmailError', async () => {
                    return expect((invalidReq = api.registerInit({ email, password }))).rejects.toThrow({
                        name: 'InvalidEmailError',
                        message: 'The email must be valid and must not contain upper case letters or spaces.',
                    });
                });
            });
        });

        describe('given an existing user', () => {
            const email = env.TEST_USER_1_EMAIL;
            it('throws UserAlreadyExistsError', async () => {
                return expect(api.registerInit({ email, password: 'valid-password-1' })).rejects.toThrow({
                    name: 'UserExistsError',
                    message: 'There is an existing user with the given email address.',
                });
            });
        });
    });

    describe('registerVerify', () => {
        const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
        describe.each(invalidEmails)('given an invalid email address', (email: string) => {
            it('throws InvalidEmailError', async () => {
                return expect(api.registerVerify({ email, verificationCode: '123456' })).rejects.toThrow({
                    name: 'InvalidEmailError',
                    message: 'The email must be valid and must not contain upper case letters or spaces.',
                });
            });
        });
    });

    describe('registerVerifyResend', () => {
        const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
        describe.each(invalidEmails)('given an invalid email address', (email: string) => {
            it('throws InvalidEmailError', async () => {
                return expect(api.registerVerifyResend({ email })).rejects.toThrow({
                    name: 'InvalidEmailError',
                    message: 'The email must be valid and must not contain upper case letters or spaces.',
                });
            });
        });
    });

    describe('login', () => {
        const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
        describe.each(invalidEmails)('given an invalid email address', (email: string) => {
            it('throws InvalidEmailError', async () => {
                return expect(api.login({ email, password: 'some-pass' })).rejects.toThrow({
                    name: 'InvalidEmailError',
                    message: 'The email must be valid and must not contain upper case letters or spaces.',
                });
            });
        });
    });

    describe('refreshSession', () => {
        // const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
        // describe.each(invalidEmails)('given an invalid email address', (email: string) => {
        //     it('throws InvalidEmailError', async () => {
        //         return expect(api.refreshSession()).rejects.toThrow({
        //             name: 'InvalidEmailError',
        //             message: 'The email must be valid and must not contain upper case letters or spaces.',
        //         });
        //     });
        // });
    });

    describe('resetPasswordInit', () => {
        const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
        describe.each(invalidEmails)('given an invalid email address', (email: string) => {
            it('throws InvalidEmailError', async () => {
                return expect(api.resetPasswordInit({ email })).rejects.toThrow({
                    name: 'InvalidEmailError',
                    message: 'The email must be valid and must not contain upper case letters or spaces.',
                });
            });
        });
    });

    describe('resetPasswordVerify', () => {
        const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
        describe.each(invalidEmails)('given an invalid email address', (email: string) => {
            it('throws InvalidEmailError', async () => {
                return expect(
                    api.resetPasswordVerify({ email, verificationCode: '', password: '', oldPassword: '' }),
                ).rejects.toThrow({
                    name: 'InvalidEmailError',
                    message: 'The email must be valid and must not contain upper case letters or spaces.',
                });
            });
        });
    });
});
