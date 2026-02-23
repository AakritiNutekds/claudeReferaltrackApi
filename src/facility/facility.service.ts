import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    FacilityDto,
  } from './dto';
  
  @Injectable()
  export class facilityService {
    constructor(private prisma: PrismaService) {}
  
    getFacilities() {
      return this.prisma.facility.findMany({
      });
    }
  
    getFacilityById(
      facilityId: number,
    ) {
      return this.prisma.facility.findFirst({
        where: {
          facilityId: facilityId,
        },
      });
    }
  
    async createFacility(
      dto: FacilityDto,
    ) {
      const facility =
        await this.prisma.facility.create({
          data: {
            ...dto,
          },
        });
  
      return facility;
    }
  
    async editFacilityById(
      facilityId: number,
      dto: FacilityDto,
    ) {
      // get the facility by id
      const facility =
        await this.prisma.facility.findUnique({
          where: {
            facilityId: facilityId,
          },
        });
  
      // check if user owns the facility
      if (!facility || facility.facilityId !== facilityId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.facility.update({
        where: {
          facilityId: facilityId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteFacilityById(
      facilityId: number,
    ) {
      const facility =
        await this.prisma.facility.findUnique({
          where: {
            facilityId: facilityId,
          },
        });
  
      // check if user owns the facility
      if (!facility || facility.facilityId !== facilityId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.facility.delete({
        where: {
          facilityId: facilityId,
        },
      });
    }
  }