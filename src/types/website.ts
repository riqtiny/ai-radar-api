import { z } from 'zod';

export const WebsiteSchema = z.object({
    hostname: z.string(),
    name: z.string(),
    logo: z.string().url().or(z.string()),
    description: z.string(),
    rating: z.number().nullable().optional(),
    review: z.any().nullable().optional(),
    reviewed_on: z.union([z.string(), z.number()]).nullable().optional(),
});

export type Website = z.infer<typeof WebsiteSchema>;
