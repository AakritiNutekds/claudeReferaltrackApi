import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PatientProviderDTO
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class patientProviderService {
  constructor(private prisma: PrismaService) { }

  getPatientProviders() {
    return this.prisma.patientProvider.findMany({
    });
  }

  getPatientProviderById(
    ppId: number,
  ) {
    return this.prisma.patientProvider.findFirst({
      where: {
        ppId: ppId,
      },
    });
  }
  getPatientProviderByPatientIdAndProviderId(
    patientId: number,
    providerId: number,
  ) {
    return this.prisma.patientProvider.findFirst({
      where: {
        patientId: patientId,
        providerId: providerId,
        isActive: true
      },
    });
  }
  getPatientProviderByPatientIdProviderIdAndTypeId(
    patientId: number,
    providerId: number,
    typeId: number
  ) {
    return this.prisma.patientProvider.findFirst({
      where: {
        patientId: patientId,
        providerId: providerId,
        typeId: typeId,
        isActive: true
      },
    });
  }
  getPatientProviderByPatientId(patientId: number,) {
    const result = this.prisma.$queryRaw(Prisma.sql`
      select A."ppId", A."patientId", A."providerId", B."providerName", B."npi", B."address", B."city", B."state", B."zip", D."description" As "country",
      B."phonenumberWork", B."phonenumberMobile", B."emailAddress", B."primaryTaxonomy", C."value" As "type"
      from patientproviders As A
      inner join providers As B on A."providerId"=B."providerId"
      inner join providerTypes As C on A."typeId"=C."typeId"
      left join countries As D on B."countryId"=D."countryId"
      Where A."isActive" = '1' And A."patientId"=${patientId} order by C."value" desc;`);
    return result;
  }

  async createPatientProvider(
    dto: PatientProviderDTO,
  ) {
    const patientProvider =
      await this.prisma.patientProvider.create({
        data: {
          ...dto,
        },
      });

    return patientProvider;
  }

  async editPatientProviderById(
    ppId: number,
    dto: PatientProviderDTO,
  ) {
    // get the patientProvider by id
    const patientProvider =
      await this.prisma.patientProvider.findUnique({
        where: {
          ppId: ppId,
        },
      });

    // check if user owns the patientProvider
    if (!patientProvider || patientProvider.ppId !== ppId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.patientProvider.update({
      where: {
        ppId: ppId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletePatientProviderById(
    ppId: number,
  ) {
    const patientProvider =
      await this.prisma.patientProvider.findUnique({
        where: {
          ppId: ppId,
        },
      });

    // check if user owns the patientProvider
    if (!patientProvider || patientProvider.ppId !== ppId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.patientProvider.delete({
      where: {
        ppId: ppId,
      },
    });
  }
}