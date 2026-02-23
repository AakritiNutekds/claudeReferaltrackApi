import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UserOrganizationMapDto,
} from './dto';

@Injectable()
export class userOrganizationMapService {
  constructor(private prisma: PrismaService) { }

  getUserOrganizationMaps() {
    return this.prisma.userOrganizationMap.findMany({
    });
  }

  getUserOrganizationMapById(
    mapId: number,
  ) {
    return this.prisma.userOrganizationMap.findFirst({
      where: {
        mapId: mapId,
      },
    });
  }
  getUserOrganizationMapByUserIdAndOrganizationId(
    userId: number,
    organizationId: number
  ) {
    return this.prisma.userOrganizationMap.findFirst({
      where: {
        userId: userId,
        organizationId:organizationId
      },
    });
  }

  async createUserOrganizationMap(
    dto: UserOrganizationMapDto,
  ) {
    const userOrganizationMap =
      await this.prisma.userOrganizationMap.create({
        data: {
          ...dto,
        },
      });

    return userOrganizationMap;
  }

  async editUserOrganizationMapById(
    mapId: number,
    dto: UserOrganizationMapDto,
  ) {
    // get the userOrganizationMap by id
    const userOrganizationMap =
      await this.prisma.userOrganizationMap.findUnique({
        where: {
          mapId: mapId,
        },
      });

    // check if user owns the userOrganizationMap
    if (!userOrganizationMap || userOrganizationMap.mapId !== mapId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.userOrganizationMap.update({
      where: {
        mapId: mapId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteUserOrganizationMapById(
    mapId: number,
  ) {
    const userOrganizationMap =
      await this.prisma.userOrganizationMap.findUnique({
        where: {
          mapId: mapId,
        },
      });

    // check if user owns the userOrganizationMap
    if (!userOrganizationMap || userOrganizationMap.mapId !== mapId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.userOrganizationMap.delete({
      where: {
        mapId: mapId,
      },
    });
  }
}