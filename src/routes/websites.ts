import { Hono } from 'hono';
import { RedisCache } from '../cache/redisCache.ts';
import { fetchWebsites } from '../services/scraper.ts';
import { CONFIG } from '../config/env.ts';
import type { Website } from '../types/website.ts';

const websiteRoutes = new Hono();
const cache = new RedisCache(CONFIG.CACHE_TTL_MS);
const CACHE_KEY = 'websites_data';

websiteRoutes.get('/', async (c) => {
    try {
        let websites = await cache.get<Website[]>(CACHE_KEY);

        if (!websites) {
            console.log('Redis cache miss. Fetching fresh data...');
            websites = await fetchWebsites();
            await cache.set(CACHE_KEY, websites);
        } else {
            console.log('Serving from Redis cache.');
        }

        return c.json(websites);
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

websiteRoutes.get('/:hostname', async (c) => {
    const hostname = c.req.param('hostname');

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

        return c.json(website);
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
