import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CodesetProviderRoleMapDto,
} from './dto';

@Injectable()
export class codesetProviderRoleMapService {
  constructor(private prisma: PrismaService) { }

  getcodesetProviderRoleMaps() {
    return this.prisma.codesetProviderRoleMap.findMany({
    });
  }

  getcodesetProviderRoleMapById(
    mapId: number,
  ) {
    return this.prisma.codesetProviderRoleMap.findFirst({
      where: {
        mapId: mapId,
      },
    });
  }
  getcodesetProviderRoleMapBycodesetIdAndProviderRoleId(
    codesetId: number,
    providerRoleId:number
  ) {
    return this.prisma.codesetProviderRoleMap.findFirst({
      where: {
        codesetId: codesetId,
        providerRoleId:providerRoleId
      },
    });
  }

  async createcodesetProviderRoleMap(
    dto: CodesetProviderRoleMapDto,
  ) {
    const codesetProviderRoleMap =
      await this.prisma.codesetProviderRoleMap.create({
        data: {
          ...dto,
        },
      });

    return codesetProviderRoleMap;
  }

  async editcodesetProviderRoleMapById(
    mapId: number,
    dto: CodesetProviderRoleMapDto,
  ) {
    // get the codesetProviderRoleMap by id
    const codesetProviderRoleMap =
      await this.prisma.codesetProviderRoleMap.findUnique({
        where: {
          mapId: mapId,
        },
      });

    // check if codeset owns the codesetProviderRoleMap
    if (!codesetProviderRoleMap || codesetProviderRoleMap.mapId !== mapId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.codesetProviderRoleMap.update({
      where: {
        mapId: mapId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletecodesetProviderRoleMapById(
    mapId: number,
  ) {
    const codesetProviderRoleMap =
      await this.prisma.codesetProviderRoleMap.findUnique({
        where: {
          mapId: mapId,
        },
      });

    // check if codeset owns the codesetProviderRoleMap
    if (!codesetProviderRoleMap || codesetProviderRoleMap.mapId !== mapId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.codesetProviderRoleMap.delete({
      where: {
        mapId: mapId,
      },
    });
  }
}