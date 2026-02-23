import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CodeSetDTO
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class codeSetService {
  constructor(private prisma: PrismaService) { }

  getCodeSets() {
    return this.prisma.codeSet.findMany({
    });
  }

  getAllMappedCodesets() {
    const result = this.prisma.$queryRaw(Prisma.sql`
        Select A.*, B."description" as "category" from codesets A
left outer join categories B on A."categoryId"=B."categoryId"
where "codesetId" in (select "codesetId" from codesetproviderrolemaps);`);
    return result;
  }

  getCodesetTypeForMainGroup(
    mainGroup: string,
  ) {
    return this.prisma.codeSet.findMany({
      where: {
        mainGroup: mainGroup,
      },
    });
  }
  getCodesetForCode(
    code: string,
  ) {
    return this.prisma.codeSet.findFirst({
      where: {
        code: code,
      },
    });
  }
  getCodeSetById(
    codesetId: number,
  ) {
    return this.prisma.codeSet.findFirst({
      where: {
        codesetId: codesetId,
      },
    });
  }

  getAllcodesetForProviderRoleId(providerRoleId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
        Select * from codesets where "codesetId" in (select "codesetId" from codesetproviderrolemaps where "providerRoleId"=${providerRoleId});`);
    return result;
  }

  getAllcodesetForNotProviderRoleId(providerRoleId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
        Select * from codesets where "codesetId" not in (select "codesetId" from codesetproviderrolemaps where "providerRoleId"=${providerRoleId});`);
    return result;
  }

  async createCodeSet(
    dto: CodeSetDTO,
  ) {
    const codeSet =
      await this.prisma.codeSet.create({
        data: {
          ...dto,
        },
      });

    return codeSet;
  }

  async editCodeSetById(
    codesetId: number,
    dto: CodeSetDTO,
  ) {
    // get the codeSet by id
    const codeSet =
      await this.prisma.codeSet.findUnique({
        where: {
          codesetId: codesetId,
        },
      });

    // check if user owns the codeSet
    if (!codeSet || codeSet.codesetId !== codesetId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.codeSet.update({
      where: {
        codesetId: codesetId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCodeSetById(
    codesetId: number,
  ) {
    const codeSet =
      await this.prisma.codeSet.findUnique({
        where: {
          codesetId: codesetId,
        },
      });

    // check if user owns the codeSet
    if (!codeSet || codeSet.codesetId !== codesetId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.codeSet.delete({
      where: {
        codesetId: codesetId,
      },
    });
  }
}