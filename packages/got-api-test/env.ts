import { z } from 'zod';

export const MAIL_USERNAME = z
    .string()
    .describe('IMAP mailbox username to API test endpoints that send automatic emails.');
export const MAIL_USER_PW = z
    .string()
    .describe('IMAP mailbox password to API test endpoints that send automatic emails.');
export const MAIL_IMAP_SERVER = z
    .string()
    .describe('IMAP server of the mailbox that is used to test mail sending API endpoints.');
export const TEST_USER_1_EMAIL = z
    .string()
    .describe('Email address of the first test user. It should exist in the specified user pool.');
export const TEST_USER_1_PW = z
    .string()
    .describe('Password of the first test user. It is necessary to make authenticated API calls in the test suites.');
export const TEST_USER_2_EMAIL = z
    .string()
    .describe('Email address of the second test user. It should exist in the specified user pool.');
export const TEST_USER_2_PW = z
    .string()
    .describe('Password of the second test user. It is necessary to make authenticated API calls in the test suites.');
