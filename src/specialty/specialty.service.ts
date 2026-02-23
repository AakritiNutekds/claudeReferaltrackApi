import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SpecialtyDto,
} from './dto';

@Injectable()
export class specialtyService {
  constructor(private prisma: PrismaService) { }

  getSpecialties() {
    return this.prisma.specialty.findMany({
      orderBy: {
        description: 'asc',
      },
    });
  }

  getSpecialtyById(
    specialtyId: number,
  ) {
    return this.prisma.specialty.findFirst({
      where: {
        specialtyId: specialtyId,
      },
    });
  }

  async createSpecialty(
    dto: SpecialtyDto,
  ) {
    const specialty =
      await this.prisma.specialty.create({
        data: {
          ...dto,
        },
      });

    return specialty;
  }

  async editSpecialtyById(
    specialtyId: number,
    dto: SpecialtyDto,
  ) {
    // get the specialty by id
    const specialty =
      await this.prisma.specialty.findUnique({
        where: {
          specialtyId: specialtyId,
        },
      });

    // check if user owns the specialty
    if (!specialty || specialty.specialtyId !== specialtyId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.specialty.update({
      where: {
        specialtyId: specialtyId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteSpecialtyById(
    specialtyId: number,
  ) {
    const specialty =
      await this.prisma.specialty.findUnique({
        where: {
          specialtyId: specialtyId,
        },
      });

    // check if user owns the specialty
    if (!specialty || specialty.specialtyId !== specialtyId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.specialty.delete({
      where: {
        specialtyId: specialtyId,
      },
    });
  }
}