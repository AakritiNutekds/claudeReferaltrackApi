import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ProviderTypeDto,
} from './dto';

@Injectable()
export class providerTypeService {
  constructor(private prisma: PrismaService) { }

  getProviderTypes() {
    return this.prisma.providerType.findMany({
      orderBy: {
        value: 'asc',
      },
    });
  }

  getProviderTypeById(
    typeId: number,
  ) {
    return this.prisma.providerType.findFirst({
      where: {
        typeId: typeId,
      },
    });
  }

  async createProviderType(
    dto: ProviderTypeDto,
  ) {
    const providerType =
      await this.prisma.providerType.create({
        data: {
          ...dto,
        },
      });

    return providerType;
  }

  async editProviderTypeById(
    typeId: number,
    dto: ProviderTypeDto,
  ) {
    // get the providerType by id
    const providerType =
      await this.prisma.providerType.findUnique({
        where: {
          typeId: typeId,
        },
      });

    // check if user owns the providerType
    if (!providerType || providerType.typeId !== typeId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.providerType.update({
      where: {
        typeId: typeId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProviderTypeById(
    typeId: number,
  ) {
    const providerType =
      await this.prisma.providerType.findUnique({
        where: {
          typeId: typeId,
        },
      });

    // check if user owns the providerType
    if (!providerType || providerType.typeId !== typeId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.providerType.delete({
      where: {
        typeId: typeId,
      },
    });
  }
}