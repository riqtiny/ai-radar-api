import Redis from 'ioredis';
import { CONFIG } from '../config/env.ts';

export class RedisCache {
    private client: Redis;

    constructor(private defaultTtlMs: number) {
        this.client = new Redis({
            host: CONFIG.REDIS.HOST,
            port: CONFIG.REDIS.PORT,
            password: CONFIG.REDIS.PASSWORD,
            tls: CONFIG.REDIS.TLS ? {} : undefined,
            retryStrategy: (times) => Math.min(times * 50, 2000),
            maxRetriesPerRequest: null,
        });

        this.client.on('error', (err) => console.error('Redis Error:', err));
    }

    async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
        const ttlSeconds = Math.floor((ttlMs ?? this.defaultTtlMs) / 1000);
        const data = JSON.stringify(value);
        await this.client.set(key, data, 'EX', ttlSeconds);
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        if (!data) return null;
        try {
            return JSON.parse(data) as T;
        } catch (error) {
            console.error(`Error parsing Redis data for key ${key}:`, error);
            return null;
        }
    }

    async delete(key: string): Promise<void> {
        await this.client.del(key);
    }

    async quit(): Promise<void> {
        await this.client.quit();
    }
}
