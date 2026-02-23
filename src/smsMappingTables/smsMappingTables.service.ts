import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SMSMappingTablesDto } from './dto';

@Injectable()
export class smsMappingTablesService {
  constructor(private prisma: PrismaService) {}

  getSMSMappingTables() {
    return this.prisma.sMSMappingTable.findMany({});
  }

  getSMSMappingTablesById(id: number) {
    return this.prisma.sMSMappingTable.findFirst({
      where: {
        id: id,
      },
    });
  }

  getWaitingSMSMappingTablesByPhoneNumber(phoneNumber: string) {
    return this.prisma.sMSMappingTable.findFirst({
      where: {
        phoneNumber: phoneNumber,
        status: 'WAITING',
      },
    });
  }

  getSMSMappingTablesByPhoneNumber(phoneNumber: string) {
    return this.prisma.sMSMappingTable.findMany({
      where: {
        phoneNumber: phoneNumber,
      },
    });
  }

  async createSMSMappingTables(dto: SMSMappingTablesDto) {
    const SMSMappingTables = await this.prisma.sMSMappingTable.create({
      data: {
        ...dto,
      },
    });

    return SMSMappingTables;
  }

  async editSMSMappingTablesById(id: number, dto: SMSMappingTablesDto) {
    // get the SMSMappingTables by id
    const SMSMappingTables = await this.prisma.sMSMappingTable.findUnique({
      where: {
        id: id,
      },
    });

    // check if user owns the SMSMappingTables
    if (!SMSMappingTables || SMSMappingTables.id !== id)
      throw new ForbiddenException('Access to resources denied');

    return this.prisma.sMSMappingTable.update({
      where: {
        id: id,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteSMSMappingTablesById(id: number) {
    const SMSMappingTables = await this.prisma.sMSMappingTable.findUnique({
      where: {
        id: id,
      },
    });

    // check if user owns the SMSMappingTables
    if (!SMSMappingTables || SMSMappingTables.id !== id)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.sMSMappingTable.delete({
      where: {
        id: id,
      },
    });
  }
}
