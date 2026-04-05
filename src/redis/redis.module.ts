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
                const client = new Redis({
                    host: process.env.REDIS_HOST,
                    port: Number(process.env.REDIS_PORT),
                    password: process.env.REDIS_PASSWORD,
                    retryStrategy: (times) => {
                        if (times > 2) return null;
                        return 500;
                    },

                    reconnectOnError: () => false,
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