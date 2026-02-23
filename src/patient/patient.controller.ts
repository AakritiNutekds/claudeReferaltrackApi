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
import {
  PatientDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from 'fs';

@SetMetadata('auditResource', 'patient')
@UseGuards(JwtGuard, TenantGuard)
@Controller('patients')
export class patientController {
  constructor(
    private patientService: patientService,
  ) { }

  @Get()
  getPatients(@GetUser('organizationId') organizationId: number) {
    return this.patientService.getPatients(organizationId);
  }

  @Get('All/:id')
  getPatientsForUserId(
    @Param('id', ParseIntPipe) userId: number,
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

  @Get('getPatientImage/:patientId/image')
  async getPatientImage(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Res() res: Response, // Include Response in the parameter list
  ): Promise<void> {
    const filePath = this.patientService.getPatientImageById(patientId);

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

  @Post()
  createPatient(
    @Body() dto: PatientDto,
  ) {
    return this.patientService.createPatient(
      dto,
    );
  }

  @Post('createPatientWithImage')
  @UseInterceptors(FileInterceptor('file'))
  createPatientWithImage(@UploadedFile() file: Express.Multer.File, @Body() dto: { dto }) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.patientService.createPatientWithImage(
      obj,
      file
    );
  }

  @Patch(':id')
  editPatientById(
    @Param('id', ParseIntPipe) Id: number,
    @Body() dto: PatientDto,
  ) {
    return this.patientService.editPatientById(
      Id,
      dto,
    );
  }
  @Patch('editPatientByIdWithImage/:id')
  @UseInterceptors(FileInterceptor('file'))
  editPatientByIdWithImage(
    @Param('id', ParseIntPipe) Id: number,
    @UploadedFile() file: Express.Multer.File, @Body() dto: { dto }
  ) {
    const obj = JSON.parse(JSON.stringify(dto.dto));
    return this.patientService.editPatientByIdWithImage(
      Id,
      obj,
      file
    );
  }

  @Roles('canDelete')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deletePatientById(
    @Param('id', ParseIntPipe) patientId: number,
  ) {
    return this.patientService.deletePatientById(
      patientId,
    );
  }
}