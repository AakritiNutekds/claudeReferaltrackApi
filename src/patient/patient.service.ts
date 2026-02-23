import {
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PatientDto,
} from './dto';
import * as fs from 'fs';
import { Prisma } from '@prisma/client';
import { extname } from 'path';
import { compressImageService } from '../compressImage/compressImgae.service'
@Injectable()
export class patientService {
  constructor(private prisma: PrismaService) { }

  getPatients(organizationId: number) {
    return this.prisma.patient.findMany({
      where: { organizationId },
    });
  }

  getPatientsForUserId(userId: number, organizationId: number) {
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

  async getPatientById(
    patientId: number,
    organizationId: number,
  ) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        patientId,
        organizationId,
      },
    });
    return patient;
  }

  async getPatientByAlternateId(
    alternateId: string,
    organizationId: number,
  ) {
    const patient = await this.prisma.patient.findFirst({
      where: {
        alternateId,
        organizationId,
      },
    });
    return patient;
  }

  getPatientImageById(patientId: number) {
    const folderPath = `./uploads/patients/${patientId}`;
    const possibleExtensions = ['.jpeg', '.jpg', '.png'];
    for (const ext of possibleExtensions) {
      const filePath = `${folderPath}/patient-${patientId}${ext}`;
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    const defaultPath = './uploads/default/default.jpg';
    return defaultPath;
  }


  async createPatient(
    dto: PatientDto,
  ) {
    const patient =
      await this.prisma.patient.create({
        data: {
          ...dto,
        },
      });

    return patient;
  }

  async editPatientById(
    patientId: number,
    dto: PatientDto,
  ) {
    // get the patient by id
    const patient =
      await this.prisma.patient.findUnique({
        where: {
          patientId: patientId,
        },
      });

    // check if user owns the patient
    if (!patient || patient.patientId !== patientId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    return this.prisma.patient.update({
      where: {
        patientId: patientId,
      },
      data: {
        ...dto,
      },
    });
  }
  async createPatientWithImage(dto: PatientDto, file: Express.Multer.File) {
    // Create the patient in the database
    const patient = await this.prisma.patient.create({
      data: {
        alternateId: dto.alternateId && dto.alternateId != '' && dto.alternateId != 'null' ? dto.alternateId : null,
        firstName: dto.firstName && dto.firstName != '' && dto.firstName != 'null' ? dto.firstName : null,
        lastName: dto.lastName && dto.lastName != '' && dto.lastName != 'null' ? dto.lastName : null,
        organizationId: +dto.organizationId,
        doNotCall: Boolean(dto.doNotCall),
        createdBy: +dto.createdBy,
        modifiedBy: +dto.modifiedBy,
        isActive: Boolean(dto.isActive),
      },
    });
    if (file) {
      const folderPath = `./uploads/patients/${patient.patientId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `patient-${patient.patientId}${extname(file.originalname)}`;
      const filePath = `${folderPath}/${fileName}`;
      fs.writeFileSync(filePath, file.buffer);
      const cImage = new compressImageService();
      cImage.processImage(filePath, filePath)
        .then(result => {
        })
        .catch(error => {
          console.error(error); // Error handling
        });
      const patient1 = await this.prisma.patient.update({
        where: {
          patientId: patient.patientId,
        },
        data: {
          patientImageName: fileName
        },
      });
    }
    return patient;
  }

async editPatientByIdWithImage(
    patientId: number,
    dto: PatientDto,
    file: Express.Multer.File
  ) {
    // get the patient by id
    const patient =
      await this.prisma.patient.findUnique({
        where: {
          patientId: patientId,
        },
      });

    // check if user owns the patient
    if (!patient || patient.patientId !== patientId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    const updatePatient = this.prisma.patient.update({
      where: {
        patientId: patientId,
      },
      data: {
        alternateId: dto.alternateId && dto.alternateId != '' && dto.alternateId != 'null' ? dto.alternateId : null,
        firstName: dto.firstName && dto.firstName != '' && dto.firstName != 'null' ? dto.firstName : null,
        lastName: dto.lastName && dto.lastName != '' && dto.lastName != 'null' ? dto.lastName : null,
        organizationId: +dto.organizationId,
        doNotCall: Boolean(dto.doNotCall),
        createdBy: +dto.createdBy,
        modifiedBy: +dto.modifiedBy,
        isActive: Boolean(dto.isActive),
      },
    });
    if (file) {
      const folderPath = `./uploads/patients/${patient.patientId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `patient-${patient.patientId}${extname(file.originalname)}`;
      const filePath = `${folderPath}/${fileName}`;
      fs.writeFileSync(filePath, file.buffer);
      const cImage = new compressImageService();
      cImage.processImage(filePath, filePath)
        .then(result => {
        })
        .catch(error => {
          console.error(error); // Error handling
        });
      const patient1 = await this.prisma.patient.update({
        where: {
          patientId: patient.patientId,
        },
        data: {
          patientImageName: fileName
        },
      });
    }
    return updatePatient;
  }



  async deletePatientById(
    patientId: number,
  ) {
    const patient =
      await this.prisma.patient.findUnique({
        where: {
          patientId: patientId,
        },
      });

    // check if user owns the patient
    if (!patient || patient.patientId !== patientId)
      throw new ForbiddenException(
        'Access to resources denied',
      );

    await this.prisma.patient.delete({
      where: {
        patientId: patientId,
      },
    });
  }
}