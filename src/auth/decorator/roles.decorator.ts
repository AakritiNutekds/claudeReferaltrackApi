import { SetMetadata } from '@nestjs/common';
import { RolePermission, ROLES_KEY } from '../guard/roles.guard';

/**
 * Require one or more role permissions on a route or controller.
 *
 * Example:
 *   @Roles('canManageUsers')
 *   @UseGuards(JwtGuard, RolesGuard)
 *   @Post()
 *   createUser() { ... }
 */
export const Roles = (...permissions: RolePermission[]) =>
  SetMetadata(ROLES_KEY, permissions);
