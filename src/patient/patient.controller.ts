import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
  NotFoundException
} from '@nestjs/common';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { GetUser, Roles } from '../auth/decorator';
import { TenantGuard } from '../common/guards/tenant.guard';
import { patientService } from './patient.service';
import { PatientDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';

@SetMetadata('auditResource', 'patient')
@UseGuards(JwtGuard, TenantGuard)
@Controller('patients')
export class patientController {
  constructor(private patientService: patientService) {}

  @Get()
  getPatients(@GetUser('organizationId') organizationId: number) {
    return this.patientService.getPatients(organizationId);
  }

  // TASK 4: userId sourced from JWT (@GetUser), not from the URL param.
  // Route path kept intact for backwards-compat; the :id segment is ignored.
  @Get('All/:id')
  getPatientsForUserId(
    @GetUser('userId') userId: number,
    @GetUser('organizationId') organizationId: number,
  ) {
    return this.patientService.getPatientsForUserId(userId, organizationId);
  }

  @Get(':id')
  getPatientById(
    @Param('id', ParseIntPipe) patientId: number,
    @GetUser('organizationId') organizationId: number,
  ) {
    return this.patientService.getPatientById(patientId, organizationId);
  }

  @Get('getPatientByAlternateId/:alternateId')
  getPatientByAlternateId(
    @Param('alternateId') alternateId: string,
    @GetUser('organizationId') organizationId: number,
  ) {
    return this.patientService.getPatientByAlternateId(alternateId, organizationId);
  }

  // TASK 2: organizationId now passed to service — image is only served if the
  // patient belongs to the requesting tenant.
  @Get('getPatientImage/:patientId/image')
  async getPatientImage(
    @Param('patientId', ParseIntPipe) patientId: number,
    @GetUser('organizationId') organizationId: number,
    @Res() res: Response,
  ): Promise<void> {
    const filePath = await this.patientService.getPatientImageById(patientId, organizationId);

    if (!filePath) {
      res.status(404).send('File not found');
      return;
    }
    try {
      const imageBuffer = fs.readFileSync(filePath);
      const base64Image = imageBuffer.toString('base64');
      res.status(200).json({ data: base64Image });
    } catch (error) {
      console.error('Error reading image file', error);
      throw new NotFoundException('Patient image not found');
    }
  }

  // TASK 2+3: organizationId and actorId come from JWT, not request body.
  @Post()
  createPatient(
    @Body() dto: PatientDto,
    @GetUser('organizationId') organizationId: number,
    @GetUser('userId') actorId: number,
  ) {
    return this.patientService.createPatient(dto, organizationId, actorId);
  }

  // TASK 2+3: organizationId and actorId come from JWT, not request body.
  @Post('createPatientWithImage')
  @UseInterceptors(FileInterceptor('file'))
  createPatientWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: { dto },
    @GetUser('organizationId') organizationId: number,
    @GetUser('userId') actorId: number,
  ) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.patientService.createPatientWithImage(obj, file, organizationId, actorId);
  }

  // TASK 2+3: organizationId and actorId come from JWT, not request body.
  @Patch(':id')
  editPatientById(
    @Param('id', ParseIntPipe) Id: number,
    @Body() dto: PatientDto,
    @GetUser('organizationId') organizationId: number,
    @GetUser('userId') actorId: number,
  ) {
    return this.patientService.editPatientById(Id, dto, organizationId, actorId);
  }

  // TASK 2+3: organizationId and actorId come from JWT, not request body.
  @Patch('editPatientByIdWithImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  editPatientByIdWithImage(
    @Param('id', ParseIntPipe) Id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: { dto },
    @GetUser('organizationId') organizationId: number,
    @GetUser('userId') actorId: number,
  ) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.patientService.editPatientByIdWithImage(Id, obj, file, organizationId, actorId);
  }

  @Roles('canDelete')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePatientById(
    @Param('id', ParseIntPipe) patientId: number,
    @GetUser('organizationId') organizationId: number,
  ) {
    return this.patientService.deletePatientById(patientId, organizationId);
  }
}
