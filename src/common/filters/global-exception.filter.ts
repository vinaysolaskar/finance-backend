import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
    ) { }
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let message: any;

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = typeof res === 'string' ? { message: res } : res;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = { message: exception.message || 'Internal server error' };
        }

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            ...message,
        });

        this.logger.error('Unhandled Exception', {
            context: 'ExceptionFilter',
            status,
            path: request.url,
            method: request.method,
            message: exception.message || message,
            response: exception.getResponse?.() || null,
            stack: exception.stack,
        });
    }
}