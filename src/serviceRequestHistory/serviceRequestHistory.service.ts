import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ServiceRequestHistoryDto
} from './dto';

@Injectable()
export class serviceRequestHistoryService {
  constructor(private prisma: PrismaService) { }

  getServiceRequestHistorys() {
    return this.prisma.serviceRequestHistory.findMany({
    });
  }

  getServiceRequestHistoryById(
    historyId: number,
  ) {
    return this.prisma.serviceRequestHistory.findFirst({
      where: {
        historyId: historyId,
      },
    });
  }
  getLastServiceRequestHistoryByRequestId(
    requestId: number,
  ) {
    return this.prisma.serviceRequestHistory.findFirst({
      where: {
        serviceRequestId: requestId,
      },
      orderBy: {
        historyId: 'desc',
      },
    });
  }

  async createServiceRequestHistory(
    dto: ServiceRequestHistoryDto,
  ) {
    const serviceRequestHistory =
      await this.prisma.serviceRequestHistory.create({
        data: {
          ...dto,
        },
      });

    return serviceRequestHistory;
  }

  async editServiceRequestHistoryById(
    historyId: number,
    dto: ServiceRequestHistoryDto
  ) {
    // get the serviceRequestHistory by id
    const serviceRequestHistory =
      await this.prisma.serviceRequestHistory.findUnique({
        where: {
          historyId: historyId,
        },
      });

    // check if user owns the serviceRequestHistory
    if (!serviceRequestHistory || serviceRequestHistory.historyId !== historyId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.serviceRequestHistory.update({
      where: {
        historyId: historyId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteServiceRequestHistoryById(
    historyId: number,
  ) {
    const serviceRequestHistory =
      await this.prisma.serviceRequestHistory.findUnique({
        where: {
          historyId: historyId,
        },
      });

    // check if user owns the serviceRequestHistory
    if (!serviceRequestHistory || serviceRequestHistory.historyId !== historyId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.serviceRequestHistory.delete({
      where: {
        historyId: historyId,
      },
    });
  }
}