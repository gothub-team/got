import { z } from 'zod';

export const parseEnv = <T extends Record<string, z.Schema>>(schemaObject: T): z.infer<typeof schema> => {
    const schema = z.object(schemaObject);
    try {
        const result = schema.parse(process.env);
        return result;
    } catch (error) {
        const redBold = '\x1b[1;31m';
        const italicGrey = '\x1b[3;90m';
        const resetB = '\x1b[0m';
        const resetI = '\x1b[0m';
        let result = '\nInvalid environment variables:\n';
        (error as z.ZodError).errors.forEach((e) => {
            result += `${redBold}${e.path.join('.')}:${resetB} ${e.message} ${italicGrey}${schemaObject[e.path[0]]._def.description}${resetI} \n`;
        });
        throw result;
    }
};

export const awsRegions = [
    'af-south-1',
    'ap-east-1',
    'ap-northeast-1',
    'ap-northeast-2',
    'ap-northeast-3',
    'ap-south-1',
    'ap-south-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-southeast-3',
    'ap-southeast-4',
    'ca-central-1',
    'ca-west-1',
    'cn-north-1',
    'cn-northwest-1',
    'eu-central-1',
    'eu-central-2',
    'eu-north-1',
    'eu-south-1',
    'eu-south-2',
    'eu-west-1',
    'eu-west-2',
    'eu-west-3',
    'me-central-1',
    'me-south-1',
    'sa-east-1',
    'us-gov-east-1',
    'us-gov-west-1',
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
] as const;

export const AWS_REGION = z.enum(awsRegions).describe('Main AWS region where resources are deployed.');
export const AWS_PROFILE = z.string().describe('AWS profile to use for deployment.');
export const GOT_API_DOMAIN = z.string().describe('Domain where the got API should be deployed.');
export const GOT_API_URL = z.string().endsWith('/').describe('URL of the API Gateway endpoint for the got API.');
export const USER_POOL_ID = z.string().describe('Cognito user pool ID that authorizes API requests.');
export const AWS_MAIL_REGION = z.enum(awsRegions).describe('AWS region where the mail domain is hosted.');
export const MAIL_DOMAIN = z.string().describe('Domain of the mail server.');
export const FILE_HOSTING_DOMAIN = z.string().describe('Domain of the file hosting service.');
export const MAIL_USERNAME = z
    .string()
    .describe('IMAP mailbox username to API test endpoints that send automatic emails.');
export const MAIL_USER_PW = z
    .string()
    .describe('IMAP mailbox password to API test endpoints that send automatic emails.');
export const MAIL_IMAP_SERVER = z
    .string()
    .describe('IMAP server of the mailbox that is used to test mail sending API endpoints.');

export const NOTIFICATIONS_EMAIL_SENDER = z
    .string()
    .describe('Display name of the sender of the notifications emails.');
export const NOTIFICATIONS_EMAIL_HOST = z.string().describe('SMTP host of the email server that sends notifications.');
export const NOTIFICATIONS_EMAIL_USER = z
    .string()
    .describe('SMTP username of the email server that sends notifications.');
export const NOTIFICATIONS_EMAIL_PASSWORD = z
    .string()
    .describe('SMTP password of the email server that sends notifications.');
export const NOTIFICATIONS_EMAIL_PORT = z.string().describe('SMTP port of the email server that sends notifications.');
export const NOTIFICATIONS_EMAIL_SECURE_FLAG = z
    .string()
    .toLowerCase()
    .transform((value) => JSON.parse(value))
    .pipe(z.boolean())
    .describe('Flag that indicates if the email server uses secure connection.');
