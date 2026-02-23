import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    CancellationReasonDto
  } from './dto';
  
  @Injectable()
  export class cancellationReasonService {
    constructor(private prisma: PrismaService) {}
  
    getcancellationReasons() {
      return this.prisma.cancellationReason.findMany({
        orderBy: {
          description: 'asc',
        },
      });
    }
  
    getcancellationReasonById(
      cancellationReasonId: number,
    ) {
      return this.prisma.cancellationReason.findFirst({
        where: {
          cancellationReasonId: cancellationReasonId,
        },
      });
    }
  
    async createcancellationReason(
      dto: CancellationReasonDto,
    ) {
      const cancellationReason =
        await this.prisma.cancellationReason.create({
          data: {
            ...dto,
          },
        });
  
      return cancellationReason;
    }
  
    async editcancellationReasonById(
      cancellationReasonId: number,
      dto: CancellationReasonDto,
    ) {
      // get the cancellationReason by id
      const cancellationReason =
        await this.prisma.cancellationReason.findUnique({
          where: {
            cancellationReasonId: cancellationReasonId,
          },
        });
  
      // check if user owns the cancellationReason
      if (!cancellationReason || cancellationReason.cancellationReasonId !== cancellationReasonId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.cancellationReason.update({
        where: {
          cancellationReasonId: cancellationReasonId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deletecancellationReasonById(
      cancellationReasonId: number,
    ) {
      const cancellationReason =
        await this.prisma.cancellationReason.findUnique({
          where: {
            cancellationReasonId: cancellationReasonId,
          },
        });
  
      // check if user owns the cancellationReason
      if (!cancellationReason || cancellationReason.cancellationReasonId !== cancellationReasonId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.cancellationReason.delete({
        where: {
          cancellationReasonId: cancellationReasonId,
        },
      });
    }
  }