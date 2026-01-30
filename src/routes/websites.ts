import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { RedisCache } from '../cache/redisCache.ts';
import { fetchWebsites } from '../services/scraper.ts';
import { CONFIG } from '../config/env.ts';
import { WebsiteSchema, type Website } from '../types/website.ts';

const websiteRoutes = new OpenAPIHono();
const cache = new RedisCache(CONFIG.CACHE_TTL_MS);
const CACHE_KEY = 'websites_data';

// Route definition: List all websites
const listWebsitesRoute = createRoute({
    method: 'get',
    path: '/',
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: z.array(WebsiteSchema),
                },
            },
            description: 'Returns a list of all tracked websites',
        },
        500: {
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                        message: z.string(),
                    }),
                },
            },
            description: 'Internal server error',
        },
    },
    tags: ['Websites'],
    summary: 'List all websites',
    operationId: 'listWebsites',
});

// Route definition: Get website by hostname
const getWebsiteByHostnameRoute = createRoute({
    method: 'get',
    path: '/{hostname}',
    request: {
        params: z.object({
            hostname: z.string().openapi({
                example: 'github.com',
                description: 'The hostname of the website to retrieve',
            }),
        }),
    },
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: WebsiteSchema,
                },
            },
            description: 'Returns the website details for the given hostname',
        },
        404: {
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                    }),
                },
            },
            description: 'Website not found',
        },
        500: {
            content: {
                'application/json': {
                    schema: z.object({
                        error: z.string(),
                        message: z.string(),
                    }),
                },
            },
            description: 'Internal server error',
        },
    },
    tags: ['Websites'],
    summary: 'Get website by hostname',
    operationId: 'getWebsiteByHostname',
});

// Implementation: List all websites
websiteRoutes.openapi(listWebsitesRoute, async (c) => {
    try {
        let websites = await cache.get<Website[]>(CACHE_KEY);

        if (!websites) {
            console.log('Redis cache miss. Fetching fresh data...');
            websites = await fetchWebsites();
            await cache.set(CACHE_KEY, websites);
        } else {
            console.log('Serving from Redis cache.');
        }

        return c.json(websites, 200);
    } catch (error) {
        return c.json(
            {
                error: 'Failed to retrieve websites',
                message:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            500,
        );
    }
});

// Implementation: Get website by hostname
websiteRoutes.openapi(getWebsiteByHostnameRoute, async (c) => {
    const { hostname } = c.req.valid('param');

    try {
        let websites = await cache.get<Website[]>(CACHE_KEY);

        if (!websites) {
            websites = await fetchWebsites();
            await cache.set(CACHE_KEY, websites);
        }

        const website = websites.find((w) => w.hostname === hostname);

        if (!website) {
            return c.json({ error: 'Website not found' }, 404);
        }

        return c.json(website, 200);
    } catch (error) {
        return c.json(
            {
                error: 'Failed to retrieve website',
                message:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            500,
        );
    }
});

export { websiteRoutes };
