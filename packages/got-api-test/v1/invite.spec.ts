import { describe, beforeAll, afterAll, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { createMailClient } from './shared/mail';
import { GOT_API_URL, parseEnv } from '@gothub/typescript-util';
import {
    INVITE_USER_ROOT,
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
    INVITE_USER_ROOT,
});

const [TEST_MAIL_PREFIX, TEST_MAIL_DOMAIN] = env.MAIL_USERNAME.split('@');

let testId: string;
let adminApi: GotApi;
let api: GotApi;
let mailClient: ReturnType<typeof createMailClient>;
beforeAll(async () => {
    adminApi = await createUserApi(env.TEST_ADMIN_EMAIL, env.TEST_ADMIN_PW, true);
    api = await createUserApi(env.TEST_USER_1_EMAIL, env.TEST_USER_1_PW);
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});

describe('invite user flow', () => {
    describe('given user 1 has read rights on root', () => {
        let email: string;
        beforeAll(async () => {
            const pb = await adminApi.push({
                rights: {
                    [env.INVITE_USER_ROOT]: { user: { [env.TEST_USER_1_EMAIL]: { admin: true } } },
                },
            });
            console.log(pb.rights?.['root'].user);
            email = `${TEST_MAIL_PREFIX}+${testId}@${TEST_MAIL_DOMAIN}`;
        });
        afterAll(async () => {
            await adminApi.push({
                rights: {
                    [env.INVITE_USER_ROOT]: { user: { [env.TEST_USER_1_EMAIL]: { admin: false } } },
                },
            });
        });

        describe('response', () => {
            it('resolves without error', async () => {
                return expect(api.inviteUser({ email, id: env.INVITE_USER_ROOT })).resolves.toBeUndefined();
            });
        });

        describe('invitation mail', () => {
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
                    const emailPromise = mailClient.receiveMailTo(email);
                    const emailBody = (await emailPromise).replaceAll('=\r\n', '');
                    expect(emailBody).toContain('You have been invited.');
                    expect(emailBody).toContain('Please log in with your temporary password: ');
                });
            });
        });
    });
});

describe('error handling', () => {
    const invalidEmails = [[''], ['Tes.T@test.com'], ['tes.t@tesT.com'], [' tes.t@test.com'], ['tes.t@test.com ']];
    describe.each(invalidEmails)('given an invalid email address', (email: string) => {
        it.todo('throws InvalidEmailError', async () => {
            return expect(api.inviteUser({ email, id: env.INVITE_USER_ROOT })).rejects.toThrow({
                name: 'InvalidEmailError',
                message: 'The email must be valid and must not contain upper case letters or spaces.',
            });
        });
    });

    describe('given an existing user', () => {
        const email = env.TEST_USER_2_EMAIL;
        it.todo('throws UserAlreadyExistsError', async () => {
            return expect(api.inviteUser({ email, id: env.INVITE_USER_ROOT })).rejects.toThrow({
                name: 'UserExistsError',
                message: 'There is an existing user with the given email address.',
            });
        });
    });
});
