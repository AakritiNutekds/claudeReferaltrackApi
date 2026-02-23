import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TaskBusinessStatusDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class taskBusinessStatusService {
  constructor(private prisma: PrismaService) { }

  getTaskBusinessStatuss() {
    return this.prisma.taskBusinessStatus.findMany({
    });
  }

  getTaskBusinessStatusById(
    businessStatusId: number,
  ) {
    return this.prisma.taskBusinessStatus.findFirst({
      where: {
        businessStatusId: businessStatusId,
      },
    });
  }

  getTaskBusinessStatusByType(
    type: string,
  ) {
    return this.prisma.taskBusinessStatus.findMany({
      where: {
        type: type,
      },
    });
  }

  getTaskBusinessStatusByTaskStatusId(
    taskStatusId: number,
  ) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select * from taskbusinessstatuses 
    Where "businessStatusId" in (select "businessStatusId" from statusrulesets where "taskStatusId"=${taskStatusId}) And "isActive"='1';`);
    return result;
  }
  getAllBusinessStatusByCurrentBusinessStatusId(
    currentStatusId: number,
  ) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select * from taskbusinessstatuses 
    Where "businessStatusId" in (select "businessStatusId" from businessstatusrulesets where "workflowId"=${currentStatusId}) And "isActive"='1';`);
    return result;
  }

  async createTaskBusinessStatus(
    dto: TaskBusinessStatusDto,
  ) {
    const taskBusinessStatus =
      await this.prisma.taskBusinessStatus.create({
        data: {
          ...dto,
        },
      });

    return taskBusinessStatus;
  }

  async editTaskBusinessStatusById(
    businessStatusId: number,
    dto: TaskBusinessStatusDto,
  ) {
    // get the taskBusinessStatus by id
    const taskBusinessStatus =
      await this.prisma.taskBusinessStatus.findUnique({
        where: {
          businessStatusId: businessStatusId,
        },
      });

    // check if user owns the taskBusinessStatus
    if (!taskBusinessStatus || taskBusinessStatus.businessStatusId !== businessStatusId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.taskBusinessStatus.update({
      where: {
        businessStatusId: businessStatusId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTaskBusinessStatusById(
    businessStatusId: number,
  ) {
    const taskBusinessStatus =
      await this.prisma.taskBusinessStatus.findUnique({
        where: {
          businessStatusId: businessStatusId,
        },
      });

    // check if user owns the taskBusinessStatus
    if (!taskBusinessStatus || taskBusinessStatus.businessStatusId !== businessStatusId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.taskBusinessStatus.delete({
      where: {
        businessStatusId: businessStatusId,
      },
    });
  }
}