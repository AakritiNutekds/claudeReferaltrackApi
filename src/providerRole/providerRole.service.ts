import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ProviderRoleDto,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class providerRoleService {
  constructor(private prisma: PrismaService) { }

  getProviderRoles() {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A."providerRoleId", A."isEmployed", A."isPreferred", B."providerName",
c."name" as "organizationName", D."description" as "code", E."description" as "specialty", f."description" as "location"
from providerroles A
inner join providers B on A."providerId"=B."providerId"
inner join organizations C on A."organizationId"=C."organizationId"
inner join providerroledetails D on A."codeId"=D."codeId"
inner join specialties E on A."specialtyId"=E."specialtyId"
inner join locations F on A."locationId"=F."locationId"
where A."isActive"='1';`);
    return result;
  }

  getProviderRoleById(
    providerRoleId: number,
  ) {
    return this.prisma.providerRole.findFirst({
      where: {
        providerRoleId: providerRoleId,
      },
    });
  }

  getProviderRoleByProviderId(
    providerId: number,
  ) {
    return this.prisma.providerRole.findFirst({
      where: {
        providerId: providerId,
      },
    });
  }

  async getAllProviderRoleByProviderId(providerId: number) {
    const result = await this.prisma.$queryRaw(Prisma.sql`
        Select A."providerRoleId", A."isEmployed", A."isPreferred", B."providerName",
        c."name" as "organizationName", D."description" as "code", E."description" as "specialty", 
        F."description" as "location", F."address", F."city", F."state", F."zip"
        from providerroles A
        inner join providers B on A."providerId"=B."providerId"
        inner join organizations C on A."organizationId"=C."organizationId"
        inner join providerroledetails D on A."codeId"=D."codeId"
        inner join specialties E on A."specialtyId"=E."specialtyId"
        inner join locations F on A."locationId"=F."locationId"
        where A."isActive"='1' And A."providerId"=${providerId};
    `);

    return result; 
}

  async getSelectedProviderRoleById(providerRoleId: number) {
    const result = await this.prisma.$queryRaw(Prisma.sql`
        Select A."providerRoleId", A."isEmployed", A."isPreferred", B."providerName",
        c."name" as "organizationName", D."description" as "code", E."description" as "specialty", 
        F."description" as "location", F."address", F."city", F."state", F."zip"
        from providerroles A
        inner join providers B on A."providerId"=B."providerId"
        inner join organizations C on A."organizationId"=C."organizationId"
        inner join providerroledetails D on A."codeId"=D."codeId"
        inner join specialties E on A."specialtyId"=E."specialtyId"
        inner join locations F on A."locationId"=F."locationId"
        where A."isActive"='1' And A."providerRoleId"=${providerRoleId};
    `);

    return result[0] ?? null; // return the single object or null if not found
}

  getProviderRoleByPatientId(patientId: number,) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A."providerRoleId", A."isEmployed", A."isPreferred", B."providerName",
    c."name" as "organizationName", D."description" as "code", E."description" as "specialty", f."description" as "location", pt."value" As "type"
    from providerroles A
    inner join providers B on A."providerId"=B."providerId"
    inner join organizations C on A."organizationId"=C."organizationId"
    inner join providerroledetails D on A."codeId"=D."codeId"
    inner join specialties E on A."specialtyId"=E."specialtyId"
    inner join locations F on A."locationId"=F."locationId"
    inner join patientproviders pp on B."providerId"=pp."providerId"
    inner join providerTypes As pt on pp."typeId"=pt."typeId"
    where A."isActive"='1' And pp."patientId"=${patientId};`);
    return result;
  }


  getProviderRoleByProviderNameAndLocation(providerName: string, locationName: string, address: string, city: string, state: string) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A.*
    from providerroles A
    inner join providers B on A."providerId"=B."providerId"
    inner join locations F on A."locationId"=F."locationId"
    where B."providerName"=${providerName}; And F."description"=${locationName} And F."address"=${address} And F."city"=${city} And F."state"=${state};`);
    return result;
  }

  getProviderRoleByCodesetId(codesetId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A."providerRoleId", A."isEmployed", A."isPreferred", B."providerName",
    c."name" as "organizationName", D."description" as "code", E."description" as "specialty", 
    F."description" as "location", F."address", F."city", F."state", F."zip",  cs."code" as "codesetCode", cs."description" as "codesetDescription"
    from providerroles A
    inner join providers B on A."providerId"=B."providerId"
    inner join organizations C on A."organizationId"=C."organizationId"
    inner join providerroledetails D on A."codeId"=D."codeId"
    inner join specialties E on A."specialtyId"=E."specialtyId"
    inner join locations F on A."locationId"=F."locationId"
	  inner join codesetproviderrolemaps cpr on A."providerRoleId"=cpr."providerRoleId"
    inner join codesets cs on cpr."codesetId"=cs."codesetId"
    where A."isActive"='1' And cs."codesetId"=${codesetId};`);
    return result;
  }

  getProviderRoleNotForCodesetId(codesetId: number) {
    const result = this.prisma.$queryRaw(Prisma.sql`
    Select A."providerRoleId", A."isEmployed", A."isPreferred", B."providerName",
    c."name" as "organizationName", D."description" as "code", E."description" as "specialty", 
    F."description" as "location", F."address", F."city", F."state", F."zip"
    from providerroles A
    inner join providers B on A."providerId"=B."providerId"
    inner join organizations C on A."organizationId"=C."organizationId"
    inner join providerroledetails D on A."codeId"=D."codeId"
    inner join specialties E on A."specialtyId"=E."specialtyId"
    inner join locations F on A."locationId"=F."locationId"	  
    where A."isActive"='1' And A."providerRoleId" not in (select "providerRoleId" from codesetproviderrolemaps where "codesetId"=${codesetId})`);
    return result;
  }

  async createProviderRole(
    dto: ProviderRoleDto,
  ) {
    const providerRole =
      await this.prisma.providerRole.create({
        data: {
          ...dto,
        },
      });

    return providerRole;
  }

  async editProviderRoleById(
    providerRoleId: number,
    dto: ProviderRoleDto,
  ) {
    // get the providerRole by id
    const providerRole =
      await this.prisma.providerRole.findUnique({
        where: {
          providerRoleId: providerRoleId,
        },
      });

    // check if user owns the providerRole
    if (!providerRole || providerRole.providerRoleId !== providerRoleId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.providerRole.update({
      where: {
        providerRoleId: providerRoleId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteProviderRoleById(
    providerRoleId: number,
  ) {
    const providerRole =
      await this.prisma.providerRole.findUnique({
        where: {
          providerRoleId: providerRoleId,
        },
      });

    // check if user owns the providerRole
    if (!providerRole || providerRole.providerRoleId !== providerRoleId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.providerRole.delete({
      where: {
        providerRoleId: providerRoleId,
      },
    });
  }
}