import { z } from 'zod';

export const envSchema = z.object({
    GOT_API_URL: z.string().endsWith('/'),
});

export const env = envSchema.parse(process.env);
