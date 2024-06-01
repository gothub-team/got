import { z } from 'zod';
import { awsRegions } from '@gothub/typescript-util';

export const AWS_REGION = z.enum(awsRegions).describe('Main AWS region where resources are deployed.');
export const AWS_PROFILE = z.string().describe('AWS profile to use for deployment.');
export const MAIL_USERNAME = z
    .string()
    .describe('IMAP mailbox username to API test endpoints that send automatic emails.');
export const MAIL_USER_PW = z
    .string()
    .describe('IMAP mailbox password to API test endpoints that send automatic emails.');
export const MAIL_IMAP_SERVER = z
    .string()
    .describe('IMAP server of the mailbox that is used to test mail sending API endpoints.');
export const GOT_API_URL = z.string().endsWith('/').describe('URL of the API Gateway endpoint for the got API.');
export const USER_POOL_ID = z.string().describe('Cognito user pool ID that authorizes API requests.');
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
