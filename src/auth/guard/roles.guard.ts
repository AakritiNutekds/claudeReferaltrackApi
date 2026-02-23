import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

export type RolePermission =
  | 'canManageUsers'
  | 'canUpdateMasters'
  | 'canManageDataEntry'
  | 'canManagePatientEntry'
  | 'canDelete';

/**
 * RolesGuard — enforces role-based permissions defined on the Role model.
 *
 * Apply after JwtGuard. The JWT strategy populates req.user.role.
 *
 * Usage:
 *   @Roles('canManageUsers')
 *   @UseGuards(JwtGuard, RolesGuard)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RolePermission[]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user?.role) {
      throw new ForbiddenException('Role information not found in token');
    }

    const hasAll = requiredPermissions.every(
      (permission) => user.role[permission] === true,
    );

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
