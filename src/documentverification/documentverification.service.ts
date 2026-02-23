import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import {
    DocumentVerificationDto,
  } from './dto';
  
  @Injectable()
  export class DocumentVerificationService {
    constructor(private prisma: PrismaService) {}
  
    getDocumentVerifications() {
      return this.prisma.documentVerification.findMany({
      });
    }
  
    getDocumentVerificationById(
      verificationId: number,
    ) {
      return this.prisma.documentVerification.findFirst({
        where: {
          verificationId: verificationId,
        },
      });
    }

    getAllDocumentsByServiceRequestId(
      serviceRequestId: number,
    ) {
      return this.prisma.documentVerification.findMany({
        where: {
          serviceRequestId: serviceRequestId,
        },
      });
    }
  
    async createDocumentVerification(
      dto: DocumentVerificationDto,
    ) {
      const DocumentVerification =
        await this.prisma.documentVerification.create({
          data: {
            ...dto,
          },
        });
  
      return DocumentVerification;
    }
  
    async editDocumentVerificationById(
      verificationId: number,
      dto: DocumentVerificationDto,
    ) {
      // get the DocumentVerification by id
      const documentVerification =
        await this.prisma.documentVerification.findUnique({
          where: {
            verificationId: verificationId,
          },
        });
  
      // check if user owns the DocumentVerification
      if (!documentVerification || documentVerification.verificationId !== verificationId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      return this.prisma.documentVerification.update({
        where: {
          verificationId: verificationId,
        },
        data: {
          ...dto,
        },
      });
    }
  
    async deleteDocumentVerificationById(
      verificationId: number,
    ) {
      const documentVerification =
        await this.prisma.documentVerification.findUnique({
          where: {
            verificationId: verificationId,
          },
        });
  
      // check if user owns the DocumentVerification
      if (!documentVerification || documentVerification.verificationId !== verificationId)
        throw new ForbiddenException(
          'Access to resources denied',
        );
  
      await this.prisma.documentVerification.delete({
        where: {
          verificationId: verificationId,
        },
      });
    }
  }