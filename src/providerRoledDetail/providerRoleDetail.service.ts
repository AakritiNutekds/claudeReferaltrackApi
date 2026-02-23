import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    ProviderRoleDetailDto,
  } from './dto';
  
  @Injectable()
  export class providerRoleDetailService {
    constructor(private prisma: PrismaService) {}
  
    getProviderroledetails() {
      return this.prisma.providerRoleDetail.findMany({
      });
    }
  
    getProviderroledetailById(
      codeId: number,
    ) {
      return this.prisma.providerRoleDetail.findFirst({
        where: {
          codeId: codeId,
        },
      });
    }
  
    async createProviderroledetail(
      dto: ProviderRoleDetailDto,
    ) {
      const providerRoleDetail =
        await this.prisma.providerRoleDetail.create({
          data: {
            ...dto,
          },
        });
  
      return providerRoleDetail;
    }
  
    async editProviderroledetailById(
      codeId: number,
      dto: ProviderRoleDetailDto,
    ) {
      // get the providerRoleDetail by id
      const providerRoleDetail =
        await this.prisma.providerRoleDetail.findUnique({
          where: {
            codeId: codeId,
          },
        });
  
      // check if user owns the providerRoleDetail
      if (!providerRoleDetail || providerRoleDetail.codeId !== codeId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.providerRoleDetail.update({
        where: {
          codeId: codeId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteProviderroledetailById(
      codeId: number,
    ) {
      const providerRoleDetail =
        await this.prisma.providerRoleDetail.findUnique({
          where: {
            codeId: codeId,
          },
        });
  
      // check if user owns the providerRoleDetail
      if (!providerRoleDetail || providerRoleDetail.codeId !== codeId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.providerRoleDetail.delete({
        where: {
          codeId: codeId,
        },
      });
    }
  }