import { describe, beforeAll, it, expect } from 'bun:test';
import { createApi, type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { createMailClient } from './shared/mail';
import { GOT_API_URL, parseEnv } from '@gothub/typescript-util';
import { MAIL_IMAP_SERVER, MAIL_USERNAME, MAIL_USER_PW, TEST_USER_1_EMAIL } from '../env';

export const match6Digits = (str: string) => str.match(/[0-9]{6}/)?.[0];

const env = parseEnv({
    GOT_API_URL,
    MAIL_USERNAME,
    MAIL_USER_PW,
    MAIL_IMAP_SERVER,
    TEST_USER_1_EMAIL,
});

const [TEST_MAIL_PREFIX, TEST_MAIL_DOMAIN] = env.TEST_USER_1_EMAIL.split('@');

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

describe('auth flow', () => {
    describe('given valid credentials', () => {
        let email: string;
        let password: string;
        beforeAll(() => {
            email = `${TEST_MAIL_PREFIX}+${testId}@${TEST_MAIL_DOMAIN}`;
            password = `${testId}-pw-1`;
        });

        describe('response', () => {
            it('resolves with success message', async () => {
                return expect(api.registerInit({ email, password })).resolves.toEqual({
                    message: 'User was created. Check email for verification.',
                });
            });
        });

        describe('login unverified', () => {
            it('throws UserNotVerifiedError', async () => {
                return expect(api.login({ email, password })).rejects.toThrow({
                    name: 'UserNotVerifiedError',
                    message: 'The user must be verified with Register Verify operation.',
                });
            });
        });

        describe('password reset unverified', () => {
            it('throws UserNotVerifiedError', async () => {
                return expect(api.resetPasswordInit({ email })).rejects.toThrow({
                    name: 'UserNotVerifiedError',
                    message: 'The user must be verified with Register Verify operation.',
                });
            });
        });

        describe('verification mail', () => {
            let email: string;
            let verificationCode: string;
            beforeAll(async () => {
                email = `${TEST_MAIL_PREFIX}+${testId}@${TEST_MAIL_DOMAIN}`;
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
                describe('wrong code', () => {
                    it('throws VerificationCodeMismatchError', async () => {
                        return expect(api.registerVerify({ email, verificationCode: '123456' })).rejects.toEqual({
                            name: 'VerificationCodeMismatchError',
                            message: 'The verification code does not match.',
                        });
                    });
                });

                describe('resend', () => {
                    it('receives other verification code', async () => {
                        await api.registerVerifyResend({ email });
                        console.log('waiting for mail');
                        const verificationMail = await mailClient.receiveMailTo(email);
                        const newVerificationCode = match6Digits(verificationMail) ?? '';
                        expect(verificationCode).not.toEqual(newVerificationCode);
                        verificationCode = newVerificationCode;
                    });
                });

                describe('response', () => {
                    it('resolves with success message', async () => {
                        return expect(api.registerVerify({ email, verificationCode })).resolves.toEqual({
                            message: 'Success.',
                        });
                    });
                });

                let refreshToken: string;
                describe('login', () => {
                    it('resolves', async () => {
                        return expect(api.login({ email, password })).resolves.toBeUndefined();
                    });
                    it('has a session', async () => {
                        const session = api.getCurrentSession();
                        refreshToken = session?.refreshToken || '';
                        expect(session).toHaveProperty('accessToken');
                        expect(session).toHaveProperty('idToken');
                        expect(session).toHaveProperty('refreshToken');
                    });
                });

                describe('login refresh', () => {
                    describe('correct refresh token', () => {
                        it('resolves with ID token', async () => {
                            return expect(api.loginRefresh({ refreshToken })).resolves.toHaveProperty('idToken');
                        });
                    });
                    describe('wrong refresh token', () => {
                        it('throws InvalidRefreshTokenError', async () => {
                            return expect(
                                api.loginRefresh({ refreshToken: refreshToken.substring(1) }),
                            ).rejects.toEqual({
                                name: 'InvalidRefreshTokenError',
                                message: 'Refresh token is invalid.',
                            });
                        });
                    });
                });

                describe('reset password', () => {
                    let resetCode: string;
                    let newPassword: string;

                    describe('init', () => {
                        it('resolves with success message', async () => {
                            return expect(api.resetPasswordInit({ email })).resolves.toEqual({
                                message: 'Success.',
                            });
                        });
                    });

                    describe('verification mail', () => {
                        it('receives reset code', async () => {
                            console.log('waiting for mail');
                            const resetMail = await mailClient.receiveMailTo(email);
                            resetCode = match6Digits(resetMail) ?? '';
                            expect(resetCode).toHaveLength(6);
                        });
                    });

                    describe('wrong code', () => {
                        it('throws VerificationCodeMismatchError', async () => {
                            return expect(
                                api.resetPasswordVerify({
                                    email,
                                    verificationCode: '123456',
                                    password: 'some-pass-1',
                                    oldPassword: '',
                                }),
                            ).rejects.toEqual({
                                name: 'VerificationCodeMismatchError',
                                message: 'The verification code does not match.',
                            });
                        });
                    });

                    describe('verify', () => {
                        it('resolves with success message', async () => {
                            newPassword = `${testId}-pw-2`;
                            return expect(
                                api.resetPasswordVerify({
                                    email,
                                    verificationCode: resetCode,
                                    password: newPassword,
                                    oldPassword: password,
                                }),
                            ).resolves.toEqual({
                                message: 'Success.',
                            });
                        });
                    });

                    describe('login with new password', () => {
                        it('resolves', async () => {
                            return expect(api.login({ email, password: newPassword })).resolves.toBeUndefined();
                        });
                    });
                });
            });
        });
    });
});

describe('error handling', () => {
    describe('registerInit', () => {
        const invalidPasswords = [['tee2eee'], ['teeeeeee']];
        describe.each(invalidPasswords)(`given an invalid password`, (password: string) => {
            it('throws InvalidPasswordError', async () => {
                return expect(
                    api.registerInit({ email: `${TEST_MAIL_PREFIX}+test-1@${TEST_MAIL_DOMAIN}`, password }),
                ).rejects.toThrow({
                    name: 'InvalidPasswordError',
                    message: 'The password must contain at least 8 characters and at least 1 number.',
                });
            });
        });

        const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
        describe.each(invalidEmails)('given an invalid email address', (email: string) => {
            it('throws InvalidEmailError', async () => {
                return expect(api.registerInit({ email, password: `test-1-pw-1` })).rejects.toThrow({
                    name: 'InvalidEmailError',
                    message: 'The email must be valid and must not contain upper case letters or spaces.',
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

        describe('given a user that does not exist', () => {
            const email = `non-existing+${testId}@${TEST_MAIL_DOMAIN}`;
            it('throws UserNotFoundError', async () => {
                return expect(api.registerVerify({ email, verificationCode: '123456' })).rejects.toThrow({
                    name: 'UserNotFoundError',
                    message: 'No user was found under the given email or user ID.',
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

        describe('given a user that does not exist', () => {
            const email = `non-existing+${testId}@${TEST_MAIL_DOMAIN}`;
            it('throws UserNotFoundError', async () => {
                return expect(api.registerVerifyResend({ email })).rejects.toThrow({
                    name: 'UserNotFoundError',
                    message: 'No user was found under the given email or user ID.',
                });
            });
        });
    });

    describe('login', () => {
        const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
        describe.each(invalidEmails)('given an invalid email address', (email: string) => {
            it('throws InvalidEmailError', async () => {
                return expect(api.login({ email, password: 'some-pass-1' })).rejects.toThrow({
                    name: 'InvalidEmailError',
                    message: 'The email must be valid and must not contain upper case letters or spaces.',
                });
            });
        });

        describe('given an invalid password', () => {
            const password = 'invalid';
            it('throws LoginVerifyError', async () => {
                return expect(api.login({ email: env.TEST_USER_1_EMAIL, password })).rejects.toThrow({
                    name: 'LoginVerifyError',
                    message:
                        'The password could not be verified. Please check password, userId, secretBlock, signature and timestamp.',
                });
            });
        });

        describe('given a user that does not exist', () => {
            const email = `non-existing+${testId}@${TEST_MAIL_DOMAIN}`;
            it('throws UserNotFoundError', async () => {
                return expect(api.login({ email, password: 'some-pass-1' })).rejects.toThrow({
                    name: 'UserNotFoundError',
                    message: 'No user was found under the given email or user ID.',
                });
            });
        });
    });

    describe('loginRefresh', () => {});

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

        describe('given a user that does not exist', () => {
            const email = `non-existing+${testId}@${TEST_MAIL_DOMAIN}`;
            it('throws UserNotFoundError', async () => {
                return expect(api.resetPasswordInit({ email })).rejects.toThrow({
                    name: 'UserNotFoundError',
                    message: 'No user was found under the given email or user ID.',
                });
            });
        });
    });

    describe('resetPasswordVerify', () => {
        const invalidPasswords = [['tee2eee'], ['teeeeeee']];
        describe.each(invalidPasswords)(`given an invalid password`, (password: string) => {
            it('throws InvalidPasswordError', async () => {
                return expect(
                    api.resetPasswordVerify({
                        email: `${TEST_MAIL_PREFIX}+${testId}@${TEST_MAIL_DOMAIN}`,
                        verificationCode: '',
                        password,
                        oldPassword: '',
                    }),
                ).rejects.toThrow({
                    name: 'InvalidPasswordError',
                    message: 'The password must contain at least 8 characters and at least 1 number.',
                });
            });
        });

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

        describe('given a user that does not exist', () => {
            const email = `non-existing+${testId}@${TEST_MAIL_DOMAIN}`;
            it('throws UserNotFoundError', async () => {
                return expect(
                    api.resetPasswordVerify({
                        email,
                        verificationCode: '123456',
                        password: 'some-pass-1',
                        oldPassword: '',
                    }),
                ).rejects.toThrow({
                    name: 'UserNotFoundError',
                    message: 'No user was found under the given email or user ID.',
                });
            });
        });
    });
});
