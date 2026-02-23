import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    OrganizationDto,
  } from './dto';
import { Prisma } from '@prisma/client';
  
  @Injectable()
  export class organizationService {
    constructor(private prisma: PrismaService) {}
  
    getOrganizations() {
      return this.prisma.organization.findMany({
      });
    }
  
    getOrganizationById(
      organizationId: number,
    ) {
      return this.prisma.organization.findFirst({
        where: {
          organizationId: organizationId,
        },
      });
    }

    getAllOrganizationsForUserId(userId: number) {
      const result = this.prisma.$queryRaw(Prisma.sql`
      Select * from organizations where "organizationId" in (select "organizationId" from userorganizationmaps where "userId"=${userId}) and "isActive"='1';`);
      return result;
    }
  
    getAllOrganizationsNotForUserId(userId: number) {
      const result = this.prisma.$queryRaw(Prisma.sql`
      Select * from organizations where "organizationId" not in (select "organizationId" from userorganizationmaps where "userId"=${userId}) and "isActive"='1';`);
      return result;
    }
  
    async createOrganization(
      dto: OrganizationDto,
    ) {
      const organization =
        await this.prisma.organization.create({
          data: {
            ...dto,
          },
        });
  
      return organization;
    }
  
    async editOrganizationById(
      organizationId: number,
      dto: OrganizationDto,
    ) {
      // get the organization by id
      const organization =
        await this.prisma.organization.findUnique({
          where: {
            organizationId: organizationId,
          },
        });
  
      // check if user owns the organization
      if (!organization || organization.organizationId !== organizationId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.organization.update({
        where: {
          organizationId: organizationId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteOrganizationById(
      organizationId: number,
    ) {
      const organization =
        await this.prisma.organization.findUnique({
          where: {
            organizationId: organizationId,
          },
        });
  
      // check if user owns the organization
      if (!organization || organization.organizationId !== organizationId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.organization.delete({
        where: {
          organizationId: organizationId,
        },
      });
    }
  }