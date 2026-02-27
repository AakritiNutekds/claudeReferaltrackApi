import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PatientDto } from './dto';
import * as fs from 'fs';
import { Prisma } from '@prisma/client';
import { extname } from 'path';
import { compressImageService } from '../compressImage/compressImgae.service';

@Injectable()
export class patientService {
  constructor(private prisma: PrismaService) {}

  // ── Read operations — already org-scoped, unchanged ──────────────────────────

  getPatients(organizationId: number) {
    return this.prisma.patient.findMany({
      where: { organizationId },
    });
  }

  getPatientsForUserId(userId: number, organizationId: number) {
    // TASK 4: userId now comes from JWT (enforced in controller) — not from URL param.
    const result = this.prisma.$queryRaw(Prisma.sql`
      Select A."patientId", A."alternateId"
      from patients A
      Where A."isActive" = '1'
      And A."organizationId" = ${organizationId}
      And A."patientId" In(Select Distinct "patientId" from patientproviders Where "providerId" in (select distinct "providerId" from userprovidermaps where "userId" = ${userId}))
      order by A."patientId" desc;
      `);
    return result;
  }

  async getPatientById(patientId: number, organizationId: number) {
    const patient = await this.prisma.patient.findFirst({
      where: { patientId, organizationId },
    });
    return patient;
  }

  async getPatientByAlternateId(alternateId: string, organizationId: number) {
    const patient = await this.prisma.patient.findFirst({
      where: { alternateId, organizationId },
    });
    return patient;
  }

  // TASK 2: organizationId added — patient must belong to requesting org before image is served.
  async getPatientImageById(patientId: number, organizationId: number): Promise<string | null> {
    const patient = await this.prisma.patient.findFirst({
      where: { patientId, organizationId },
      select: { patientId: true },
    });
    // Return null if patient doesn't exist in this org — controller will 404.
    if (!patient) return null;

    const folderPath = `./uploads/patients/${patientId}`;
    const possibleExtensions = ['.jpeg', '.jpg', '.png'];
    for (const ext of possibleExtensions) {
      const filePath = `${folderPath}/patient-${patientId}${ext}`;
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    return './uploads/default/default.jpg';
  }

  // ── Write operations — TASK 2+3 ──────────────────────────────────────────────
  //
  // organizationId and audit fields (createdBy, modifiedBy) are set from JWT claims
  // passed by the controller. They are NEVER accepted from the request body.
  //
  // DTO spread ( data: { ...dto } ) replaced with explicit field mapping to prevent
  // accidental inclusion of attacker-controlled values.

  async createPatient(dto: PatientDto, organizationId: number, actorId: number) {
    const patient = await this.prisma.patient.create({
      data: {
        alternateId:     dto.alternateId,
        firstName:       dto.firstName,
        lastName:        dto.lastName,
        organizationId,            // JWT claim — NOT request body
        doNotCall:       dto.doNotCall,
        patientImageName: dto.patientImageName,
        isActive:        dto.isActive,
        createdBy:       actorId,  // JWT claim — NOT request body
        modifiedBy:      actorId,  // JWT claim — NOT request body
      },
    });
    return patient;
  }

  async createPatientWithImage(
    dto: PatientDto,
    file: Express.Multer.File,
    organizationId: number,
    actorId: number,
  ) {
    // dto arrives as a raw JSON-parsed object from multipart body — validate fields explicitly.
    const patient = await this.prisma.patient.create({
      data: {
        alternateId:  dto.alternateId && dto.alternateId !== '' && dto.alternateId !== 'null' ? dto.alternateId : null,
        firstName:    dto.firstName   && dto.firstName   !== '' && dto.firstName   !== 'null' ? dto.firstName   : null,
        lastName:     dto.lastName    && dto.lastName    !== '' && dto.lastName    !== 'null' ? dto.lastName    : null,
        organizationId,            // JWT claim — NOT request body
        doNotCall:    Boolean(dto.doNotCall),
        isActive:     Boolean(dto.isActive),
        createdBy:    actorId,     // JWT claim — NOT request body
        modifiedBy:   actorId,     // JWT claim — NOT request body
      },
    });

    if (file) {
      const folderPath = `./uploads/patients/${patient.patientId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `patient-${patient.patientId}${extname(file.originalname)}`;
      const filePath = `${folderPath}/${fileName}`;
      fs.writeFileSync(filePath, file.buffer as any);
      const cImage = new compressImageService();
      cImage.processImage(filePath, filePath)
        .then(() => {})
        .catch(error => { console.error(error); });
      await this.prisma.patient.update({
        where: { patientId: patient.patientId },
        data: { patientImageName: fileName },
      });
    }
    return patient;
  }

  async editPatientById(
    patientId: number,
    dto: PatientDto,
    organizationId: number,
    actorId: number,
  ) {
    // TASK 2: Real ownership check — org-scoped findFirst replaces the tautological
    // check that was: `if (!patient || patient.patientId !== patientId)` which always
    // passed because findUnique returned the exact id queried.
    const patient = await this.prisma.patient.findFirst({
      where: { patientId, organizationId },
    });
    if (!patient) throw new ForbiddenException('Access to resources denied');

    return this.prisma.patient.update({
      where: { patientId },
      data: {
        alternateId:      dto.alternateId,
        firstName:        dto.firstName,
        lastName:         dto.lastName,
        doNotCall:        dto.doNotCall,
        patientImageName: dto.patientImageName,
        isActive:         dto.isActive,
        modifiedBy:       actorId,  // JWT claim — NOT request body
        // organizationId intentionally omitted — org cannot be changed via edit
      },
    });
  }

  async editPatientByIdWithImage(
    patientId: number,
    dto: PatientDto,
    file: Express.Multer.File,
    organizationId: number,
    actorId: number,
  ) {
    // TASK 2: Org-scoped ownership check — same fix as editPatientById.
    const patient = await this.prisma.patient.findFirst({
      where: { patientId, organizationId },
    });
    if (!patient) throw new ForbiddenException('Access to resources denied');

    const updatePatient = this.prisma.patient.update({
      where: { patientId },
      data: {
        alternateId:  dto.alternateId && dto.alternateId !== '' && dto.alternateId !== 'null' ? dto.alternateId : null,
        firstName:    dto.firstName   && dto.firstName   !== '' && dto.firstName   !== 'null' ? dto.firstName   : null,
        lastName:     dto.lastName    && dto.lastName    !== '' && dto.lastName    !== 'null' ? dto.lastName    : null,
        doNotCall:    Boolean(dto.doNotCall),
        isActive:     Boolean(dto.isActive),
        modifiedBy:   actorId,  // JWT claim — NOT request body
        // organizationId intentionally omitted — org cannot be changed via edit
      },
    });

    if (file) {
      const folderPath = `./uploads/patients/${patient.patientId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `patient-${patient.patientId}${extname(file.originalname)}`;
      const filePath = `${folderPath}/${fileName}`;
      fs.writeFileSync(filePath, file.buffer as any);
      const cImage = new compressImageService();
      cImage.processImage(filePath, filePath)
        .then(() => {})
        .catch(error => { console.error(error); });
      await this.prisma.patient.update({
        where: { patientId: patient.patientId },
        data: { patientImageName: fileName },
      });
    }
    return updatePatient;
  }

  async deletePatientById(patientId: number, organizationId: number) {
    // TASK 2: Org-scoped ownership check — tautological `patient.patientId !== patientId`
    // check removed; findFirst with compound where enforces cross-tenant isolation.
    const patient = await this.prisma.patient.findFirst({
      where: { patientId, organizationId },
    });
    if (!patient) throw new ForbiddenException('Access to resources denied');

    await this.prisma.patient.delete({ where: { patientId } });
  }
}
