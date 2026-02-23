import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    LocationDto,
  } from './dto';
  
  @Injectable()
  export class locationService {
    constructor(private prisma: PrismaService) {}
  
    getLocations() {
      return this.prisma.location.findMany({
        orderBy: {
          description: 'asc',
        },
      });
    }
  
    getLocationById(
      locationId: number,
    ) {
      return this.prisma.location.findFirst({
        where: {
          locationId: locationId,
        },
      });
    }
  
    async createLocation(
      dto: LocationDto,
    ) {
      const location =
        await this.prisma.location.create({
          data: {
            ...dto,
          },
        });
  
      return location;
    }
  
    async editLocationById(
      locationId: number,
      dto: LocationDto,
    ) {
      // get the location by id
      const location =
        await this.prisma.location.findUnique({
          where: {
            locationId: locationId,
          },
        });
  
      // check if user owns the location
      if (!location || location.locationId !== locationId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.location.update({
        where: {
          locationId: locationId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteLocationById(
      locationId: number,
    ) {
      const location =
        await this.prisma.location.findUnique({
          where: {
            locationId: locationId,
          },
        });
  
      // check if user owns the location
      if (!location || location.locationId !== locationId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.location.delete({
        where: {
          locationId: locationId,
        },
      });
    }
  }