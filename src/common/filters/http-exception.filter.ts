import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Global exception filter.
 * - Sanitizes error responses so internal details never leak to clients.
 * - Logs full error context server-side for debugging and SIEM ingestion.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Safe client-facing message — never expose stack traces or DB errors
    const clientMessage =
      exception instanceof HttpException
        ? (exception.getResponse() as any)?.message ?? exception.message
        : 'An unexpected error occurred';

    // Full error logged server-side only
    this.logger.error(
      `[${request.method}] ${request.url} → ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
      {
        ip: request.ip,
        userId: (request as any).user?.userId ?? null,
        organizationId: (request as any).user?.organizationId ?? null,
      },
    );

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: clientMessage,
    });
  }
}
