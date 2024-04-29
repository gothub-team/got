import { z } from 'zod';

const awsRegions = [
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

export const envSchema = z.object({
    AWS_REGION: z.enum(awsRegions),
    AWS_PROFILE: z.string(),

    GOT_API_URL: z.string().endsWith('/'),
    USER_POOL_ID: z.string(),
    TEST_ADMIN_USER_EMAIL: z.string(),
    TEST_ADMIN_PW: z.string().optional(),
    TEST_USER_1_EMAIL: z.string(),
    TEST_USER_2_EMAIL: z.string(),
});

export const env = envSchema.parse(process.env);
