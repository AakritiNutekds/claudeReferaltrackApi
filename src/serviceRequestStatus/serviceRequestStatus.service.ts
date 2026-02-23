import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ServiceRequestStatusDto,
} from './dto';

@Injectable()
export class serviceRequestStatusService {
  constructor(private prisma: PrismaService) { }

  getServiceRequestStatuss() {
    return this.prisma.serviceRequestStatus.findMany({
    });
  }

  getServiceRequestStatusById(
    statusId: number,
  ) {
    return this.prisma.serviceRequestStatus.findFirst({
      where: {
        statusId: statusId,
      },
    });
  }
  getServiceRequestStatusByValue(
    value: string,
  ) {
    return this.prisma.serviceRequestStatus.findFirst({
      where: {
        value: value,
      },
    });
  }

  async createServiceRequestStatus(
    dto: ServiceRequestStatusDto,
  ) {
    const serviceRequestStatus =
      await this.prisma.serviceRequestStatus.create({
        data: {
          ...dto,
        },
      });

    return serviceRequestStatus;
  }

  async editServiceRequestStatusById(
    statusId: number,
    dto: ServiceRequestStatusDto,
  ) {
    // get the serviceRequestStatus by id
    const serviceRequestStatus =
      await this.prisma.serviceRequestStatus.findUnique({
        where: {
          statusId: statusId,
        },
      });

    // check if user owns the serviceRequestStatus
    if (!serviceRequestStatus || serviceRequestStatus.statusId !== statusId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.serviceRequestStatus.update({
      where: {
        statusId: statusId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteServiceRequestStatusById(
    statusId: number,
  ) {
    const serviceRequestStatus =
      await this.prisma.serviceRequestStatus.findUnique({
        where: {
          statusId: statusId,
        },
      });

    // check if user owns the serviceRequestStatus
    if (!serviceRequestStatus || serviceRequestStatus.statusId !== statusId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.serviceRequestStatus.delete({
      where: {
        statusId: statusId,
      },
    });
  }
}