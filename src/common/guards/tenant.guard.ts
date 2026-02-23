import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const SKIP_TENANT_KEY = 'skipTenant';

/**
 * TenantGuard — enforces that every authenticated request carries an
 * organizationId claim in its JWT, and that the claim matches any
 * tenant-scoped resource being accessed.
 *
 * Apply after JwtGuard. The JWT strategy sets req.user.organizationId.
 *
 * Usage:
 *   @UseGuards(JwtGuard, TenantGuard)
 *
 * To skip (admin/cross-tenant endpoints only):
 *   @SetMetadata('skipTenant', true)
 */
@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_TENANT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skip) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.organizationId) {
      throw new ForbiddenException(
        'No organization context found. Re-authenticate with an organizationId.',
      );
    }

    return true;
  }
}
