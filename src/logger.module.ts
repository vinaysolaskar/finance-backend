import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Module({
    imports: [
        WinstonModule.forRoot({
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json(),
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.printf(
                            ({ timestamp, level, message, context, ...meta }) =>
                                `${timestamp} [${level}] [${context || 'App'}] ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''
                                }`,
                        ),
                    ),
                }),

                new DailyRotateFile({
                    filename: 'logs/app-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '14d',
                }),

                new DailyRotateFile({
                    filename: 'logs/error-%DATE%.log',
                    level: 'error',
                    datePattern: 'YYYY-MM-DD',
                    maxFiles: '30d',
                }),
            ],
        }),
    ],
    exports: [WinstonModule],
})
export class LoggerModule { }