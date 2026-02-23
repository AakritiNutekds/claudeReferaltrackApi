import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TaskHistoryDTO
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class taskHistoryService {
  constructor(private prisma: PrismaService) { }

  getTaskHistories() {
    return this.prisma.taskHistory.findMany({
    });
  }

  getTaskHistoryById(
    historyId: number,
  ) {
    return this.prisma.taskHistory.findFirst({
      where: {
        historyId: historyId,
      },
    });
  }
  getLastTaskHistoryByTaskId(
    taskId: number,
  ) {
    return this.prisma.taskHistory.findFirst({
      where: {
        taskId: taskId,
      },
      orderBy: {
        historyId: 'desc',
      },
    });
  }
  getAllTaskHistoryByTaskId(
    taskId: number,
  ) {
    return this.prisma.taskHistory.findMany({
      where: {
        taskId: taskId,
      },
    });
  }
  getAllHistoryForTaskId(taskId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select this."historyId",this."taskStatusDate", this."description", tsts."description" as "taskStatus",
    tbsts."description" as "businessStatus", intent."description" as "intent", pri."description" as "priority",
    res."description" as "reason"
    from taskhistories this 
    inner join taskstatuses tsts on this."taskStatusId"=tsts."taskStatusId"
    inner join taskbusinessstatuses tbsts on this."businessStatusId"=tbsts."businessStatusId"
    inner join intents intent on this."intentId"=intent."intentId"
    inner join priorities pri on this."priorityId"=pri."priorityId"
    left join cancellationreasons res on this."reasonId"=res."cancellationReasonId" 
    Where this."taskId"= ${taskId} and this."isActive"='1';`);
    return result;
  }
  getAllHistoryForTaskIdAndTaskStatusId(taskId: number, taskStatusId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select this.*, tsts."description" as "taskStatus", tbsts."description" as "businessStatus"
    from taskhistories this 
    inner join taskstatuses tsts on this."taskStatusId"=tsts."taskStatusId"
    inner join taskbusinessstatuses tbsts on this."businessStatusId"=tbsts."businessStatusId"
    Where this."taskId" =${taskId} and this."taskStatusId"= ${taskStatusId} and this."businessStatusId"<> 17 and this."isActive"='1';`);
    return result;
  }

  getLastHistoryForTaskIdAndTaskStatusId(taskId: number, taskStatusId: number) {
    return this.prisma.taskHistory.findFirst({
      where: {
        taskId: taskId,
        taskStatusId: taskStatusId,
        NOT: {
          businessStatusId: 17
      }
      },
      orderBy: {
        historyId: 'desc',
      },
    });
  }

  getAllHistoryForTaskIdAndBusinessId(taskId: number, buisnessStatusId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select this.*, tsts."description" as "taskStatus", tbsts."description" as "businessStatus", usr."firstName" || ' ' || usr."lastName" as "userName"
    from taskhistories this 
    inner join taskstatuses tsts on this."taskStatusId"=tsts."taskStatusId"
    inner join taskbusinessstatuses tbsts on this."businessStatusId"=tbsts."businessStatusId"
	  inner join users as usr on this."modifiedBy"=usr."userId"
    Where this."taskId" =${taskId} and this."businessStatusId"= ${buisnessStatusId} and this."isActive"='1';`);
    return result;
  }

  async createTaskHistory(
    dto: TaskHistoryDTO,
  ) {
    const taskHistory =
      await this.prisma.taskHistory.create({
        data: {
          ...dto,
        },
      });

    return taskHistory;
  }

  async editTaskHistoryById(
    historyId: number,
    dto: TaskHistoryDTO,
  ) {
    // get the taskHistory by id
    const taskHistory =
      await this.prisma.taskHistory.findUnique({
        where: {
          historyId: historyId,
        },
      });

    // check if user owns the taskHistory
    if (!taskHistory || taskHistory.historyId !== historyId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.taskHistory.update({
      where: {
        historyId: historyId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTaskHistoryById(
    historyId: number,
  ) {
    const taskHistory =
      await this.prisma.taskHistory.findUnique({
        where: {
          historyId: historyId,
        },
      });

    // check if user owns the taskHistory
    if (!taskHistory || taskHistory.historyId !== historyId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.taskHistory.delete({
      where: {
        historyId: historyId,
      },
    });
  }
}