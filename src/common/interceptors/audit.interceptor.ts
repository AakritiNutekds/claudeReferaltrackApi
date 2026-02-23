import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

export const AUDIT_RESOURCE_KEY = 'auditResource';

/**
 * HIPAA §164.312(b) — Audit Controls.
 *
 * Decorate controllers or individual routes to log PHI access:
 *   @SetMetadata('auditResource', 'patient')
 *   @SetMetadata('auditResource', 'serviceRequest')
 *
 * Every logged entry records: userId, organizationId, action (HTTP method),
 * resource type, resource ID, IP address, user-agent, and timestamp.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const resource = this.reflector.getAllAndOverride<string>(
      AUDIT_RESOURCE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!resource) return next.handle();

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const action = request.method; // GET, POST, PATCH, DELETE
    const resourceId =
      request.params?.id ??
      request.params?.patientId ??
      request.params?.serviceRequestId ??
      null;

    return next.handle().pipe(
      tap({
        next: () => {
          this.prisma.auditLog
            .create({
              data: {
                userId: user?.userId ?? null,
                organizationId: user?.organizationId ?? null,
                action,
                resource,
                resourceId: resourceId ? String(resourceId) : null,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'] ?? null,
                details: {
                  path: request.url,
                  method: request.method,
                },
              },
            })
            .catch((err) =>
              this.logger.error('Audit log write failed', err?.message),
            );
        },
        error: (err) => {
          this.prisma.auditLog
            .create({
              data: {
                userId: user?.userId ?? null,
                organizationId: user?.organizationId ?? null,
                action: `${action}_FAILED`,
                resource,
                resourceId: resourceId ? String(resourceId) : null,
                ipAddress: request.ip,
                userAgent: request.headers['user-agent'] ?? null,
                details: {
                  path: request.url,
                  error: err?.message,
                },
              },
            })
            .catch((e) =>
              this.logger.error('Audit log write failed', e?.message),
            );
        },
      }),
    );
  }
}
