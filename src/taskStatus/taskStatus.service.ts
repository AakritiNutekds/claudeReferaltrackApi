import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TaskStatusDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class taskStatusService {
  constructor(private prisma: PrismaService) { }

  getTaskStatuss() {
    return this.prisma.taskStatus.findMany({
    });
  }

  getTaskStatusById(
    taskStatusId: number,
  ) {
    return this.prisma.taskStatus.findFirst({
      where: {
        taskStatusId: taskStatusId,
      },
    });
  }

  getTaskStatusByWorkFlowIdAndCurrentStatusId(
    workFlowId: number,
    currentStatusId:number
  ) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select * from taskstatuses Where "taskStatusId" in (select "taskStatusId" from statusrulesets where "workflowId" = ${workFlowId} and "currentStatusId"=${currentStatusId}) And "isActive"='1';`);
    return result;
  }

  async createTaskStatus(
    dto: TaskStatusDto,
  ) {
    const taskStatus =
      await this.prisma.taskStatus.create({
        data: {
          ...dto,
        },
      });

    return taskStatus;
  }

  async editTaskStatusById(
    taskStatusId: number,
    dto: TaskStatusDto,
  ) {
    // get the taskStatus by id
    const taskStatus =
      await this.prisma.taskStatus.findUnique({
        where: {
          taskStatusId: taskStatusId,
        },
      });

    // check if user owns the taskStatus
    if (!taskStatus || taskStatus.taskStatusId !== taskStatusId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.taskStatus.update({
      where: {
        taskStatusId: taskStatusId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTaskStatusById(
    taskStatusId: number,
  ) {
    const taskStatus =
      await this.prisma.taskStatus.findUnique({
        where: {
          taskStatusId: taskStatusId,
        },
      });

    // check if user owns the taskStatus
    if (!taskStatus || taskStatus.taskStatusId !== taskStatusId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.taskStatus.delete({
      where: {
        taskStatusId: taskStatusId,
      },
    });
  }
}