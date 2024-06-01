import { z } from 'zod';

export const FILE_HOSTING_BUCKET = z
    .string()
    .optional()
    .describe('S3 bucket name for the file hosting service. If not provided a new bucket will be created.');
