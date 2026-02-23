import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PatientNoteDTO
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class patientNoteService {
  constructor(private prisma: PrismaService) { }

  getPatientNotes() {
    return this.prisma.patientNote.findMany({
    });
  }

  getPatientNoteById(
    noteId: number,
  ) {
    return this.prisma.patientNote.findFirst({
      where: {
        noteId: noteId,
      },
    });
  }

  getPatientNoteBySendToId(
    sendTo: number,
  ) {
    const result = this.prisma.$queryRaw(Prisma.sql`Select A."noteId", A."patientId", A."serviceRequestId",A."noteDetails", A."noteDate", B."firstName" || ' ' || B."lastName" as "noteBy" from patientnotes A
      inner join users B on B."userId"=A."createdBy" Where A."isActive"='1' And "clearNotification"='0' And A."sendTo"=${sendTo};`);
    return result;
  }

  getPatientNotesByPatientId(patientId: number,) {
    const result = this.prisma.$queryRaw(Prisma.sql`Select A."noteId", A."patientId", A."serviceRequestId",A."noteDetails", A."noteDate", B."firstName" || ' ' || B."lastName" as "noteBy" from patientnotes A
      inner join users B on B."userId"=A."createdBy" Where A."isActive"='1' And A."patientId"=${patientId};`);
    return result;
  }

  getPatientNotesByRequestId(requestId: number,) {
    const result = this.prisma.$queryRaw(Prisma.sql`Select A."noteId", A."patientId", A."serviceRequestId",A."noteDetails", A."noteDate", B."firstName" || ' ' || B."lastName" as "noteBy" from patientnotes A
      inner join users B on B."userId"=A."createdBy" Where A."isActive"='1' And A."serviceRequestId"=${requestId};`);
    return result;
  }
  
  async createPatientNote(
    dto: PatientNoteDTO,
  ) {
    const patientNote =
      await this.prisma.patientNote.create({
        data: {
          ...dto,
        },
      });

    return patientNote;
  }

  async editPatientNoteById(
    noteId: number,
    dto: PatientNoteDTO,
  ) {
    // get the patientNote by id
    const patientNote =
      await this.prisma.patientNote.findUnique({
        where: {
          noteId: noteId,
        },
      });

    // check if user owns the patientNote
    if (!patientNote || patientNote.noteId !== noteId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.patientNote.update({
      where: {
        noteId: noteId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deletePatientNoteById(
    noteId: number,
  ) {
    const patientNote =
      await this.prisma.patientNote.findUnique({
        where: {
          noteId: noteId,
        },
      });

    // check if user owns the patientNote
    if (!patientNote || patientNote.noteId !== noteId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.patientNote.delete({
      where: {
        noteId: noteId,
      },
    });
  }
}