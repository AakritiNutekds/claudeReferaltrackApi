import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    ServiceRequestLockDto
  } from './dto';
  
  @Injectable()
  export class serviceRequestLockService {
    constructor(private prisma: PrismaService) { }
  
    getServiceRequestLocks() {
      return this.prisma.serviceRequestLock.findMany({
      });
    }
  
    getServiceRequestLockById(
      id: number,
    ) {
      return this.prisma.serviceRequestLock.findFirst({
        where: {
          id: id,
        },
      });
    }
    getServiceRequestLockByRequestId(
      requestId: number,
    ) {
      return this.prisma.serviceRequestLock.findFirst({
        where: {
          serviceRequestId: requestId,
        }
      });
    }
    getServiceRequestLockByUserId(
      userId: number,
    ) {
      return this.prisma.serviceRequestLock.findMany({
        where: {
          userId: userId,
        }
      });
    }
  
    async createServiceRequestLock(
      dto: ServiceRequestLockDto,
    ) {
      const serviceRequestLock =
        await this.prisma.serviceRequestLock.create({
          data: {
            ...dto,
          },
        });
  
      return serviceRequestLock;
    }
  
    async editServiceRequestLockById(
      id: number,
      dto: ServiceRequestLockDto
    ) {
      // get the serviceRequestLock by id
      const serviceRequestLock =
        await this.prisma.serviceRequestLock.findUnique({
          where: {
            id: id,
          },
        });
  
      // check if user owns the serviceRequestLock
      if (!serviceRequestLock || serviceRequestLock.id !== id)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.serviceRequestLock.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteServiceRequestLockById(
      id: number,
    ) {
      const serviceRequestLock =
        await this.prisma.serviceRequestLock.findUnique({
          where: {
            id: id,
          },
        });
  
      // check if user owns the serviceRequestLock
      if (!serviceRequestLock || serviceRequestLock.id !== id)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.serviceRequestLock.delete({
        where: {
          id: id,
        },
      });
    }
    deleteLocksByUserId(userId: number) {
      return this.prisma.serviceRequestLock.deleteMany({
        where: { userId: userId },
      });
    }
  }