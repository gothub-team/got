import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { createMailClient } from './shared/mail';
import { GOT_API_URL, parseEnv } from '@gothub/typescript-util';
import {
    INVITE_USER_VALIDATION_VIEW,
    MAIL_IMAP_SERVER,
    MAIL_USERNAME,
    MAIL_USER_PW,
    TEST_ADMIN_EMAIL,
    TEST_ADMIN_PW,
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
    TEST_USER_2_EMAIL,
} from '../env';
import { createUserApi } from './shared';

export const match6Digits = (str: string) => str.match(/[0-9]{6}/)?.[0];
export const matchPassword = (str: string) =>
    str.match(/password: (.+)$/)?.[1] || str.match(/password is (.+)\.$/)?.[1];

const env = parseEnv({
    GOT_API_URL,
    MAIL_USERNAME,
    MAIL_USER_PW,
    MAIL_IMAP_SERVER,
    TEST_ADMIN_EMAIL,
    TEST_ADMIN_PW,
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
    TEST_USER_2_EMAIL,
    INVITE_USER_VALIDATION_VIEW,
});

const [TEST_MAIL_PREFIX, TEST_MAIL_DOMAIN] = env.MAIL_USERNAME.split('@');
const INVITE_USER_ROOT: string | undefined = Object.keys(env.INVITE_USER_VALIDATION_VIEW)[0];
const INVITE_EDGE: string[] = Object.keys(env.INVITE_USER_VALIDATION_VIEW[INVITE_USER_ROOT]?.edges || {})[0]?.split(
    '/',
);
if (!INVITE_USER_ROOT || !INVITE_EDGE[0] || !INVITE_EDGE[1]) {
    throw new Error('INVITE_USER_VALIDATION_VIEW must contain at least one root id with at least one edge.');
}
const INVITE_NODE_ID = 'test-1e112b4d32f0ec9a-invite-node';

let adminApi: GotApi;
let userApi: GotApi;
let loginApi: GotApi;
let mailClient: ReturnType<typeof createMailClient>;
beforeAll(async () => {
    adminApi = await createUserApi(env.TEST_ADMIN_EMAIL, env.TEST_ADMIN_PW, true);
    userApi = await createUserApi(env.TEST_USER_1_EMAIL, env.TEST_USER_1_PW);
    loginApi = await createUserApi();
});

describe('invite user flow', () => {
    describe('given user has admin rights on invite user view', () => {
        let email: string;
        const testId = `test-${crypto.randomBytes(8).toString('hex')}`;
        beforeEach(async () => {
            await adminApi.push({
                nodes: {
                    [INVITE_NODE_ID]: { id: INVITE_NODE_ID },
                    [INVITE_USER_ROOT]: { id: INVITE_USER_ROOT },
                },
                edges: {
                    [INVITE_EDGE[0]]: { [INVITE_USER_ROOT]: { [INVITE_EDGE[1]]: { [INVITE_NODE_ID]: true } } },
                },
                rights: {
                    [INVITE_NODE_ID]: { user: { [env.TEST_USER_1_EMAIL]: { read: true, admin: true } } },
                    [INVITE_USER_ROOT]: { user: { [env.TEST_USER_1_EMAIL]: { read: true } } },
                },
            });
            email = `${TEST_MAIL_PREFIX}+${testId}@${TEST_MAIL_DOMAIN}`;
        });

        describe('response', () => {
            it('resolves without error', async () => {
                return expect(userApi.inviteUser({ email, id: INVITE_NODE_ID })).resolves.toEqual({
                    message: `User ${email} was successfully invited.`,
                });
            });
        });

        describe('invitation mail', () => {
            let temporaryPassword: string;
            beforeAll(async () => {
                mailClient = createMailClient({
                    host: env.MAIL_IMAP_SERVER,
                    port: 993,
                    user: env.MAIL_USERNAME,
                    pass: env.MAIL_USER_PW,
                    mailbox: 'Inbox',
                });
                await mailClient.init();
            });

            describe('default', () => {
                it('receives invitation mail', async () => {
                    const invitationMailText = await mailClient.receiveMailTo(email);
                    const emailBody = invitationMailText.replaceAll('=\r\n', '');
                    temporaryPassword = matchPassword(emailBody) || '';
                    expect(temporaryPassword).toBeTruthy();
                    expect(emailBody).toContain('password');
                });
            });

            describe('login with temporary password', () => {
                it.todo('throws PasswordChangeRequiredError', async () => {
                    return expect(loginApi.login({ email, password: temporaryPassword })).rejects.toThrow({
                        name: 'PasswordResetRequiredError',
                        message: 'The password must be reset.',
                    });
                });
            });

            describe('password reset', () => {
                let newPassword: string;
                describe('response', () => {
                    it('resets password successfully and returns session', async () => {
                        newPassword = `${crypto.randomBytes(8).toString('hex')}-pw-1`;
                        return expect(
                            loginApi.resetPasswordVerify({
                                email,
                                oldPassword: temporaryPassword,
                                password: newPassword,
                            }),
                        ).resolves.toHaveProperty('idToken');
                    });
                });

                describe('login with new password', () => {
                    it('resolves', async () => {
                        return expect(loginApi.login({ email, password: newPassword })).resolves.toBeUndefined();
                    });
                });
            });
        });
    });

    describe('given user has no admin rights on invite user view', () => {
        let email: string;
        const testId = `test-${crypto.randomBytes(8).toString('hex')}`;
        beforeEach(async () => {
            await adminApi.push({
                nodes: { [INVITE_NODE_ID]: { id: INVITE_NODE_ID } },
                edges: {
                    [INVITE_EDGE[0]]: { [INVITE_USER_ROOT]: { [INVITE_EDGE[1]]: { [INVITE_NODE_ID]: true } } },
                },
                rights: {
                    [INVITE_NODE_ID]: { user: { [env.TEST_USER_1_EMAIL]: { read: true, admin: false } } },
                    [INVITE_USER_ROOT]: { user: { [env.TEST_USER_1_EMAIL]: { read: true } } },
                },
            });
            email = `${TEST_MAIL_PREFIX}+${testId}@${TEST_MAIL_DOMAIN}`;
        });

        it('throws because of missing admin rights', async () => {
            return expect(userApi.inviteUser({ email, id: INVITE_NODE_ID })).rejects.toEqual(
                `User ${env.TEST_USER_1_EMAIL} has no admin rights on node ${INVITE_NODE_ID}`,
            );
        });
    });
});

describe('error handling', () => {
    const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
    describe.each(invalidEmails)('given an invalid email address', (email: string) => {
        it.todo('throws InvalidEmailError', async () => {
            return expect(userApi.inviteUser({ email, id: INVITE_USER_ROOT })).rejects.toThrow({
                name: 'InvalidEmailError',
                message: 'The email must be valid and must not contain upper case letters or spaces.',
            });
        });
    });

    describe('given an existing user', () => {
        const email = env.TEST_USER_2_EMAIL;
        it.todo('throws UserAlreadyExistsError', async () => {
            return expect(userApi.inviteUser({ email, id: INVITE_USER_ROOT })).rejects.toThrow({
                name: 'UserExistsError',
                message: 'There is an existing user with the given email address.',
            });
        });
    });
});
