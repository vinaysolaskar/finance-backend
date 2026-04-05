import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CacheService {
    private isRedisAvailable = true;
    private lastErrorLogTime = 0;

    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) { }

    private shouldLog(): boolean {
        const now = Date.now();

        // log only once every 30 seconds
        if (now - this.lastErrorLogTime > 30000) {
            this.lastErrorLogTime = now;
            return true;
        }

        return false;
    }

    private handleRedisError(err: unknown, context: string, meta?: any) {
        const errorMessage =
            err instanceof Error ? err.message : String(err);

        this.isRedisAvailable = false;

        if (this.shouldLog()) {
            this.logger.error(`Redis ${context} failed`, {
                ...meta,
                error: errorMessage,
            });
        }
    }

    async get<T>(key: string): Promise<T | null> {
        if (!this.isRedisAvailable) return null;

        try {
            const data = await this.redis.get(key);

            if (!data) return null;

            try {
                return JSON.parse(data);
            } catch (parseError) {
                const errorMessage =
                    parseError instanceof Error
                        ? parseError.message
                        : String(parseError);

                this.logger.error('Cache JSON parse failed', {
                    key,
                    error: errorMessage,
                });

                return null;
            }
        } catch (err) {
            this.handleRedisError(err, 'GET', { key });
            return null;
        }
    }

    async set(key: string, value: any, ttl?: number) {
        if (!this.isRedisAvailable) return;

        try {
            const data = JSON.stringify(value);

            if (ttl) {
                await this.redis.set(key, data, 'EX', ttl);
            } else {
                await this.redis.set(key, data);
            }
        } catch (err) {
            this.handleRedisError(err, 'SET', { key });
        }
    }

    async del(key: string) {
        if (!this.isRedisAvailable) return;

        try {
            await this.redis.del(key);
        } catch (err) {
            this.handleRedisError(err, 'DEL', { key });
        }
    }

    async delByPattern(pattern: string) {
        if (!this.isRedisAvailable) return;

        try {
            const keys = await this.redis.keys(pattern);

            if (keys.length) {
                await this.redis.del(...keys);
            }
        } catch (err) {
            this.handleRedisError(err, 'DEL PATTERN', { pattern });
        }
    }
}