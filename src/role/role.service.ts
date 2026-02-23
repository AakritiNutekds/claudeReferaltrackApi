import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  RoleDto,
} from './dto';

@Injectable()
export class roleService {
  constructor(private prisma: PrismaService) { }

  getRoles() {
    return this.prisma.role.findMany({
    });
  }

  getRoleById(
    roleId: number,
  ) {
    return this.prisma.role.findFirst({
      where: {
        roleId: roleId,
        isActive: true
      },
    });
  }
  getRoleByName(
    roleName: string,
  ) {
    return this.prisma.role.findFirst({
      where: {
        roleName: roleName,
        isActive: true
      },
    });
  }

  async createRole(
    dto: RoleDto,
  ) {
    const role =
      await this.prisma.role.create({
        data: {
          ...dto,
        },
      });

    return role;
  }

  async editRoleById(
    roleId: number,
    dto: RoleDto,
  ) {
    // get the role by id
    const role =
      await this.prisma.role.findUnique({
        where: {
          roleId: roleId,
        },
      });

    // check if user owns the role
    if (!role || role.roleId !== roleId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.role.update({
      where: {
        roleId: roleId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteRoleById(
    roleId: number,
  ) {
    const role =
      await this.prisma.role.findUnique({
        where: {
          roleId: roleId,
        },
      });

    // check if user owns the role
    if (!role || role.roleId !== roleId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.role.delete({
      where: {
        roleId: roleId,
      },
    });
  }
}