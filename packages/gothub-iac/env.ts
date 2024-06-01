import { z } from 'zod';
import { AWS_MAIL_REGION, AWS_PROFILE, AWS_REGION, FILE_HOSTING_DOMAIN, MAIL_DOMAIN } from '@gothub/typescript-util';

export const FILE_HOSTING_BUCKET = z
    .string()
    .optional()
    .describe('S3 bucket name for the file hosting service. If not provided a new bucket will be created.');

export const envSchema = z.object({
    AWS_REGION,
    AWS_PROFILE,
    AWS_MAIL_REGION,
    MAIL_DOMAIN,
    FILE_HOSTING_DOMAIN,
    FILE_HOSTING_BUCKET,
});

export const env = envSchema.parse(process.env);
