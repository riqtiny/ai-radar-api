export const CONFIG = {
    TARGET_URL: 'https://ai-radar.xyz/',
    CACHE_TTL_MS: 10 * 60 * 1000, // 10 minutes
    PORT: process.env.PORT || 3000,
    REDIS: {
        HOST: process.env.REDIS_HOST || 'localhost',
        PORT: Number(process.env.REDIS_PORT) || 6379,
        PASSWORD: process.env.REDIS_PASSWORD || undefined,
        TLS: process.env.REDIS_TLS === 'true' || false,
    },
};
