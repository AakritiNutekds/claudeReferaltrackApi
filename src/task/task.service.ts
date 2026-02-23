import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  TaskDTO
} from './dto';

@Injectable()
export class taskService {
  constructor(private prisma: PrismaService) { }

  getTasks() {
    return this.prisma.task.findMany({
    });
  }

  getTaskById(
    taskId: number,
  ) {
    return this.prisma.task.findFirst({
      where: {
        taskId: taskId,
      },
    });
  }
  getTaskByServiceRequestId(
    serviceRequestId: number,
  ) {
    return this.prisma.task.findFirst({
      where: {
        serviceRequestId: serviceRequestId,
      },
    });
  }

  async createTask(
    dto: TaskDTO,
  ) {
    const task =
      await this.prisma.task.create({
        data: {
          ...dto,
        },
      });

    return task;
  }

  async editTaskById(
    taskId: number,
    dto: TaskDTO,
  ) {
    // get the task by id
    const task =
      await this.prisma.task.findUnique({
        where: {
          taskId: taskId,
        },
      });

    // check if user owns the task
    if (!task || task.taskId !== taskId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.task.update({
      where: {
        taskId: taskId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteTaskById(
    taskId: number,
  ) {
    const task =
      await this.prisma.task.findUnique({
        where: {
          taskId: taskId,
        },
      });

    // check if user owns the task
    if (!task || task.taskId !== taskId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.task.delete({
      where: {
        taskId: taskId,
      },
    });
  }
}