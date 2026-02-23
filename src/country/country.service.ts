import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    CountryDto,
  } from './dto';
  
  @Injectable()
  export class countryService {
    constructor(private prisma: PrismaService) {}
  
    getCountries() {
      return this.prisma.country.findMany({
        orderBy: {
          description: 'asc',
        },
      });
    }
  
    getCountryById(
      countryId: number,
    ) {
      return this.prisma.country.findFirst({
        where: {
          countryId: countryId,
        },
      });
    }
  
    async createCountry(
      dto: CountryDto,
    ) {
      const country =
        await this.prisma.country.create({
          data: {
            ...dto,
          },
        });
  
      return country;
    }
  
    async editCountryById(
      countryId: number,
      dto: CountryDto,
    ) {
      // get the country by id
      const country =
        await this.prisma.country.findUnique({
          where: {
            countryId: countryId,
          },
        });
  
      // check if user owns the country
      if (!country || country.countryId !== countryId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.country.update({
        where: {
          countryId: countryId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteCountryById(
      countryId: number,
    ) {
      const country =
        await this.prisma.country.findUnique({
          where: {
            countryId: countryId,
          },
        });
  
      // check if user owns the country
      if (!country || country.countryId !== countryId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.country.delete({
        where: {
          countryId: countryId,
        },
      });
    }
  }