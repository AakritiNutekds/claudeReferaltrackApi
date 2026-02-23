import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  UserProviderMapDto,
} from './dto';

@Injectable()
export class userProviderMapService {
  constructor(private prisma: PrismaService) { }

  getUserProviderMaps() {
    return this.prisma.userProviderMap.findMany({
    });
  }

  getUserProviderMapById(
    mapId: number,
  ) {
    return this.prisma.userProviderMap.findFirst({
      where: {
        mapId: mapId,
      },
    });
  }
  getUserProviderMapByUserIdAndProviderId(
    userId: number,
    providerId:number
  ) {
    return this.prisma.userProviderMap.findFirst({
      where: {
        userId: userId,
        providerId:providerId
      },
    });
  }

  async createUserProviderMap(
    dto: UserProviderMapDto,
  ) {
    const userProviderMap =
      await this.prisma.userProviderMap.create({
        data: {
          ...dto,
        },
      });

    return userProviderMap;
  }

  async editUserProviderMapById(
    mapId: number,
    dto: UserProviderMapDto,
  ) {
    // get the userProviderMap by id
    const userProviderMap =
      await this.prisma.userProviderMap.findUnique({
        where: {
          mapId: mapId,
        },
      });

    // check if user owns the userProviderMap
    if (!userProviderMap || userProviderMap.mapId !== mapId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.userProviderMap.update({
      where: {
        mapId: mapId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteUserProviderMapById(
    mapId: number,
  ) {
    const userProviderMap =
      await this.prisma.userProviderMap.findUnique({
        where: {
          mapId: mapId,
        },
      });

    // check if user owns the userProviderMap
    if (!userProviderMap || userProviderMap.mapId !== mapId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.userProviderMap.delete({
      where: {
        mapId: mapId,
      },
    });
  }
}