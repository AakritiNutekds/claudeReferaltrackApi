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
    UseGuards,
  } from '@nestjs/common';
  import { JwtGuard } from '../auth/guard';
  import { patientProviderService } from './patientProvider.service';
  import {
    PatientProviderDTO
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('patientProviders')
  export class patientProviderController {
    constructor(
      private patientProviderService: patientProviderService,
    ) {}
  
    @Get()
    getPatientProviders() {
      return this.patientProviderService.getPatientProviders(
      );
    }

    @Get(':id')
    getPatientProviderById(
      @Param('id', ParseIntPipe) ppId: number,
    ) {
      return this.patientProviderService.getPatientProviderById(
        ppId,
      );
    }

    @Get('getPatientProviderByPatientId/:id')
    getPatientProviderByPatientId(
      @Param('id', ParseIntPipe) ppId: number,
    ) {
      return this.patientProviderService.getPatientProviderByPatientId(
        ppId,
      );
    }

    @Get('getPatientProviderByPatientIdProviderIdAndTypeId/:patientId/:providerId/:typeId')
    getPatientProviderByPatientIdProviderIdAndTypeId(
      @Param('patientId', ParseIntPipe) patientId: number,
      @Param('providerId', ParseIntPipe) providerId: number,
      @Param('typeId', ParseIntPipe) typeId: number
    ) {
      return this.patientProviderService.getPatientProviderByPatientIdProviderIdAndTypeId(
        patientId,
        providerId,
        typeId
      );
    }
    @Get('getPatientProviderByPatientIdAndProviderId/:patientId/:providerId')
    getPatientProviderByPatientIdAndProviderId(
      @Param('patientId', ParseIntPipe) patientId: number,
      @Param('providerId', ParseIntPipe) providerId: number,
    ) {
      return this.patientProviderService.getPatientProviderByPatientIdAndProviderId(
        patientId,
        providerId
      );
    }

    @Post()
    createPatientProvider(
      @Body() dto: PatientProviderDTO,
    ) {
      return this.patientProviderService.createPatientProvider(
        dto,
      );
    }
  
    @Patch(':id')
    editPatientProviderById(
      @Param('id', ParseIntPipe) ppId: number,
      @Body() dto: PatientProviderDTO,
    ) {
      return this.patientProviderService.editPatientProviderById(
        ppId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deletePatientProviderById(
      @Param('id', ParseIntPipe) ppId: number,
    ) {
      return this.patientProviderService.deletePatientProviderById(
        ppId,
      );
    }
  }