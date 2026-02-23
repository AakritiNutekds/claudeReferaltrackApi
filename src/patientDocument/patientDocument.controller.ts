import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { TenantGuard } from '../common/guards/tenant.guard';
import { patientDocumentService } from './patientDocument.service';
import {
  PatientDocumentDTO
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Response } from 'express';
import * as fs from 'fs';

@SetMetadata('auditResource', 'patientDocument')
@UseGuards(JwtGuard, TenantGuard)
@Controller('patientDocuments')
export class patientDocumentController {
  constructor(
    private patientDocumentService: patientDocumentService,
  ) { }

  @Get()
  getPatientDocuments() {
    return this.patientDocumentService.getPatientDocuments(
    );
  }

@Get('getPatientDocumentByNameAndType')
  getPatientDocumentByNameAndType(
    @Query('documentName') documentName: string,
    @Query('documentType') documentType: string,
    @Query('patientId', ParseIntPipe) patientId: number,
    @Query('serviceRequestId', ParseIntPipe) serviceRequestId: number,
      ) {
    return this.patientDocumentService.getPatientDocumentByNameAndType(
      documentName,
      documentType,
      patientId,
      serviceRequestId,
    );
  }

  @Get(':id')
  getPatientDocumentById(
    @Param('id', ParseIntPipe) documentId: number,
  ) {
    return this.patientDocumentService.getPatientDocumentById(
      documentId,
    );
  }

  @Get('getPatientDocumentsByPatientId/:id')
  getPatientDocumentsByPatientId(
    @Param('id', ParseIntPipe) patientId: number,
  ) {
    return this.patientDocumentService.getPatientDocumentsByPatientId(
      patientId,
    );
  }
  @Get('getPatientDocumentsByRequestId/:id')
  getPatientDocumentsByRequestId(
    @Param('id', ParseIntPipe) reqId: number,
  ) {
    return this.patientDocumentService.getPatientDocumentsByRequestId(
      reqId,
    );
  }

  @Get('getDocumentFile/:documentId/document')
  async getDocumentFile(
    @Param('documentId', ParseIntPipe) documentId: number,
    @Res() res: Response,
  ): Promise<void> {
    const filePath = this.patientDocumentService.getDocumentFileById(documentId);

    if (!filePath) {
      res.status(404).send('File not found');
      return;
    }
    try {
      const fileExtension = extname(filePath).toLowerCase();
      if (this.isImageExtension(fileExtension)) {
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString('base64');
        res.status(200).json({ data: base64Image, type: 'image' });
      }
      else if (this.isPdfExtension(fileExtension)) {
        const fileStream = fs.createReadStream(filePath);
        res.setHeader('Content-Type', 'application/pdf');
        fileStream.pipe(res);
      }
      else {
        res.status(400).send('Unsupported file type');
      }
    } catch (error) {
      console.error('Error reading file', error);
      throw new NotFoundException('User document not found');
    }
  }

  private isImageExtension(extension: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    return imageExtensions.includes(extension);
  }

  private isPdfExtension(extension: string): boolean {
    return extension === '.pdf';
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() dto: { dto }) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.patientDocumentService.createPatientDocument(obj, file);
  }

  @Post('createPatientDocumentWithoutFile')
  createPatientDocumentWithoutFile(
    @Body() dto: PatientDocumentDTO,
  ) {
    return this.patientDocumentService.createPatientDocumentWithoutFile(
      dto,
    );
  }

  @Roles('canDelete')
  @UseGuards(RolesGuard)
  @Delete(':id')
  deletePatientDocumentById(
    @Param('id', ParseIntPipe) documentId: number,
  ) {
    return this.patientDocumentService.deletePatientDocumentById(
      documentId,
    );
  }
}