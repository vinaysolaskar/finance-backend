import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) { }

    use(req: any, res: any, next: () => void) {
        if (req.originalUrl === '/favicon.ico') return next();

        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;

            const logData = {
                context: 'HTTP',
                method: req.method,
                url: req.originalUrl,
                statusCode: res.statusCode,
                duration,
                userId: req.user?.userId || null,
                ip: req.ip,
            };

            if (res.statusCode >= 500) {
                this.logger.error('HTTP Server Error', logData);
            }
            else if (res.statusCode >= 400) {
                this.logger.warn('HTTP Client Error', logData);
            }
            else if (duration > 1000) {
                this.logger.warn('Slow Request', {
                    ...logData,
                    context: 'Performance',
                });
            }
            else {
                this.logger.info('HTTP Request', logData);
            }
        });

        next();
    }
}