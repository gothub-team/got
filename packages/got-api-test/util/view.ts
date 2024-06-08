import { z } from 'zod';

const includeSchema = z
    .object({
        rights: z.boolean().optional(),
        edges: z.boolean().optional(),
        metadata: z.boolean().optional(),
        node: z.boolean().optional(),
        files: z.boolean().optional(),
    })
    .strict();
const edgeSchema = z
    .object({
        as: z.string().optional(),
        role: z.string().optional(),
        include: includeSchema.optional(),
    })
    .strict();
type ZodEdgeSchema = z.infer<typeof edgeSchema> & { edges?: Record<string, ZodEdgeSchema> };
const edgesSchema: z.ZodType<Record<string, ZodEdgeSchema>> = z.record(edgeSchema);
edgeSchema.extend({ edges: edgesSchema.optional() });
export const ViewSchema = z.record(
    z
        .object({
            as: z.string().optional(),
            role: z.string().optional(),
            edges: edgesSchema.optional(),
            include: includeSchema.optional(),
        })
        .strict(),
);
