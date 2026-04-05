import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config();


@Global()
@Module({
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: () => {
                const client = new Redis(process.env.REDIS_URL!, {
                    maxRetriesPerRequest: 1,
                    retryStrategy: (times) => {
                        if (times > 3) return null;
                        return Math.min(times * 200, 1000);
                    },
                    reconnectOnError: () => false,
                    enableReadyCheck: false,
                    lazyConnect: true,
                });

                client.on('connect', () => console.log('Redis connected'));
                client.on('error', (err) => console.error('Redis error', { error: err }));

                return client;
            },
        },
    ],
    exports: ['REDIS_CLIENT'],
})
export class RedisModule { }