import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    PriorityDto,
  } from './dto';
  
  @Injectable()
  export class priorityService {
    constructor(private prisma: PrismaService) {}
  
    getPriorities() {
      return this.prisma.priority.findMany({
        orderBy: {
          description: 'asc',
        },
      });
    }
  
    getPriorityById(
      priorityId: number,
    ) {
      return this.prisma.priority.findFirst({
        where: {
          priorityId: priorityId,
        },
      });
    }
  
    async createPriority(
      dto: PriorityDto,
    ) {
      const priority =
        await this.prisma.priority.create({
          data: {
            ...dto,
          },
        });
  
      return priority;
    }
  
    async editPriorityById(
      priorityId: number,
      dto: PriorityDto,
    ) {
      // get the priority by id
      const priority =
        await this.prisma.priority.findUnique({
          where: {
            priorityId: priorityId,
          },
        });
  
      // check if user owns the priority
      if (!priority || priority.priorityId !== priorityId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.priority.update({
        where: {
          priorityId: priorityId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deletePriorityById(
      priorityId: number,
    ) {
      const priority =
        await this.prisma.priority.findUnique({
          where: {
            priorityId: priorityId,
          },
        });
  
      // check if user owns the priority
      if (!priority || priority.priorityId !== priorityId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.priority.delete({
        where: {
          priorityId: priorityId,
        },
      });
    }
  }