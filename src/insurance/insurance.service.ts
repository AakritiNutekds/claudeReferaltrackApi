import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  InsuranceDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class insuranceService {
  constructor(private prisma: PrismaService) { }

  getInsurances() {
    return this.prisma.insurance.findMany({
    });
  }

  getInsurancesWithAlternateId() {
    return this.prisma.insurance.findMany({
      where: {
        alternateId: {
          not: null,
        }
      }
    });
  }

  getInsuranceById(
    insuranceId: number,
  ) {
    return this.prisma.insurance.findFirst({
      where: {
        insuranceId: insuranceId,
      },
    });
  }


  async createInsurance(
    dto: InsuranceDto,
  ) {
    const insurance =
      await this.prisma.insurance.create({
        data: {
          ...dto,
        },
      });

    return insurance;
  }

  async editInsuranceById(
    insuranceId: number,
    dto: InsuranceDto,
  ) {
    // get the insurance by id
    const insurance =
      await this.prisma.insurance.findUnique({
        where: {
          insuranceId: insuranceId,
        },
      });

    // check if user owns the insurance
    if (!insurance || insurance.insuranceId !== insuranceId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.insurance.update({
      where: {
        insuranceId: insuranceId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteInsuranceById(
    insuranceId: number,
  ) {
    const insurance =
      await this.prisma.insurance.findUnique({
        where: {
          insuranceId: insuranceId,
        },
      });

    // check if user owns the insurance
    if (!insurance || insurance.insuranceId !== insuranceId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.insurance.delete({
      where: {
        insuranceId: insuranceId,
      },
    });
  }
}