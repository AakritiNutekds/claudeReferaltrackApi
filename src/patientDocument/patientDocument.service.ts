import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PatientDocumentDTO } from './dto';
import * as fs from 'fs';
import { Prisma } from '@prisma/client';
import { extname } from 'path';

@Injectable()
export class patientDocumentService {
  constructor(private prisma: PrismaService) {}

  getPatientDocuments() {
    return this.prisma.patientDocument.findMany({});
  }

  getPatientDocumentById(documentId: number) {
    return this.prisma.patientDocument.findFirst({
      where: {
        documentId: documentId,
      },
    });
  }
  getPatientDocumentByNameAndType(
    documentName: string,
    documentType: string,
    patientId: number,
    serviceRequestId: number,
  ) {
    if (documentType === 'Patient') {
      return this.prisma.patientDocument.findFirst({
        where: {
          documentName: documentName,
          patientId: patientId,
        },
      });
    } else {
      return this.prisma.patientDocument.findFirst({
        where: {
          documentName: documentName,
          serviceRequestId: serviceRequestId,
        },
      });
    }
  }

  getDocumentFileById(documentId: number) {
    const folderPath = `./uploads/documents/${documentId}`;
    const possibleExtensions = ['.jpeg', '.jpg', '.png', '.pdf'];
    for (const ext of possibleExtensions) {
      const filePath = `${folderPath}/document-${documentId}${ext}`;
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }
    const defaultPath = './uploads/default/default.jpg';
    return defaultPath;
  }
  getPatientDocumentsByPatientId(patientId: number) {
    const result = this.prisma
      .$queryRaw(Prisma.sql`Select A."documentId", A."documentName", A."documentType", A."description", B."firstName" || ' ' || B."lastName" as "loadBy" from patientdocuments A
      inner join users B on B."userId"=A."createdBy" Where A."patientId"=${patientId} and A."serviceRequestId" is null;`);
    return result;
  }

  getPatientDocumentsByRequestId(requestId: number) {
    const result = this.prisma
      .$queryRaw(Prisma.sql`Select A."documentId", A."documentName", A."documentType", A."description", B."firstName" || ' ' || B."lastName" as "loadBy" from patientdocuments A
      inner join users B on B."userId"=A."createdBy" Where A."serviceRequestId"=${requestId};`);
    return result;
  }

  async createPatientDocument(dto: PatientDocumentDTO, file) {
    if (!file) {
      throw new Error('No file uploaded');
    } else {
      const patientDocument = await this.prisma.patientDocument.create({
        data: {
          patientId: +dto.patientId,
          serviceRequestId:
            dto.serviceRequestId && dto.serviceRequestId > 0
              ? +dto.serviceRequestId
              : null,
          documentName: file.originalname,
          description: dto.description,
          createdBy: +dto.createdBy,
          isActive: Boolean(dto.isActive),
        },
      });
      const folderPath = `./uploads/documents/${patientDocument.documentId}`;
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
      const fileName = `document-${patientDocument.documentId}${extname(
        file.originalname,
      )}`;
      const filePath = `${folderPath}/${fileName}`;
      fs.writeFileSync(filePath, file.buffer);
      return patientDocument;
    }
  }
  async createPatientDocumentWithoutFile(dto: PatientDocumentDTO) {
    const organization = await this.prisma.patientDocument.create({
      data: {
        ...dto,
      },
    });

    return organization;
  }
  async deletePatientDocumentById(documentId: number) {
    const patientDocument = await this.prisma.patientDocument.findUnique({
      where: {
        documentId: documentId,
      },
    });

    // check if user owns the patientDocument
    if (!patientDocument || patientDocument.documentId !== documentId)
      throw new ForbiddenException('Access to resources denied');

    await this.prisma.patientDocument.delete({
      where: {
        documentId: documentId,
      },
    });
  }
}
