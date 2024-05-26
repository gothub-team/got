import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { createApi, type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { env } from '../env';
import { createMailClient } from './shared/mail';

export const match6Digits = (str: string) => str.match(/[0-9]{6}/)?.[0];

let testId: string;
let api: GotApi;
let invalidReq: Promise<unknown>;
let mailClient: ReturnType<typeof createMailClient>;
beforeAll(async () => {
    api = createApi({
        host: env.GOT_API_URL,
        adminMode: false,
        sessionExpireTime: 1000 * 60 * 5,
    });
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
    mailClient = createMailClient({
        host: env.MAIL_IMAP_SERVER,
        port: 993,
        user: `info@${env.BASE_DOMAIN}`,
        pass: env.MAIL_USER_PW,
        mailbox: 'Inbox',
    });
    await mailClient.init();
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

    describe('given valid credentials', () => {
        const email = `info+${testId}@${env.BASE_DOMAIN}`;
        const password = `${testId}-pw-1`;
        let registerInitRequest: unknown;

        beforeAll(async () => {
            registerInitRequest = api.registerInit({ email, password });
        });

        describe('response', () => {
            it('resolves with success message', async () => {
                return expect(registerInitRequest).resolves.toEqual({
                    message: 'User was created. Check email for verification.',
                });
            });
        });

        describe('given the user receives the verification email', () => {
            let verificationCode: string;
            beforeAll(async () => {
                const verificationMail = await mailClient.receiveMailTo(email);
                verificationCode = match6Digits(verificationMail) ?? '';
                console.log(verificationCode);
            });

            describe('verifiaction Code', () => {
                it('is a 6-digit number', () => {
                    expect(verificationCode).toHaveLength(6);
                });
            });

            describe('given the user submits the verification code', () => {
                let verifyRequest: Promise<unknown>;
                beforeAll(async () => {
                    verifyRequest = api.registerVerify({ email, verificationCode });
                });

                describe('response', () => {
                    it('resolves with success message', async () => {
                        return expect(verifyRequest).resolves.toEqual({
                            message: 'Success.',
                        });
                    });
                });

                describe('given the user logs in', () => {
                    let loginRequest: Promise<void>;
                    beforeAll(async () => {
                        loginRequest = api.login({ email, password });
                    });

                    describe('response', () => {
                        it('resolves', async () => {
                            return expect(loginRequest).resolves.toBeUndefined();
                        });
                    });
                });
            });
        });
    });
});
