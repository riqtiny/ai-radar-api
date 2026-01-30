import { z } from '@hono/zod-openapi';

export const WebsiteSchema = z
    .object({
        hostname: z.string().openapi({
            example: 'github.com',
            description: 'The unique hostname of the website',
        }),
        name: z.string().openapi({
            example: 'GitHub',
            description: 'The display name of the website',
        }),
        logo: z.string().url().or(z.string()).openapi({
            example: 'https://github.com/favicon.ico',
            description: 'The URL or path to the website logo',
        }),
        description: z.string().openapi({
            example: 'A platform for developers.',
            description: 'A brief description of the website',
        }),
        rating: z
            .number()
            .nullable()
            .optional()
            .openapi({
                example: 4.5,
                description: 'The average rating of the website',
            }),
        review: z
            .any()
            .nullable()
            .optional()
            .openapi({
                description: 'Detailed review information',
            }),
        reviewed_on: z
            .union([z.string(), z.number()])
            .nullable()
            .optional()
            .openapi({
                example: '2026-01-26',
                description: 'The date when the website was reviewed (ISO 8601 date string or Unix timestamp)',
            }),
    })
    .openapi('Website');

export type Website = z.infer<typeof WebsiteSchema>;
