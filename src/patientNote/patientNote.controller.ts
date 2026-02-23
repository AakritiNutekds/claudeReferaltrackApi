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
    UseGuards,
  } from '@nestjs/common';
  import { JwtGuard, RolesGuard } from '../auth/guard';
  import { Roles } from '../auth/decorator';
  import { TenantGuard } from '../common/guards/tenant.guard';
  import { patientNoteService } from './patientNote.service';
  import {
    PatientNoteDTO
  } from './dto';

  @SetMetadata('auditResource', 'patientNote')
  @UseGuards(JwtGuard, TenantGuard)
  @Controller('patientNotes')
  export class patientNoteController {
    constructor(
      private patientNoteService: patientNoteService,
    ) {}
  
    @Get()
    getPatientNotes() {
      return this.patientNoteService.getPatientNotes(
      );
    }
  
    @Get(':id')
    getPatientNoteById(
      @Param('id', ParseIntPipe) noteId: number,
    ) {
      return this.patientNoteService.getPatientNoteById(
        noteId,
      );
    }
    @Get('getPatientNotesByPatientId/:id')
    getPatientNotesByPatientId(
      @Param('id', ParseIntPipe) patientId: number,
    ) {
      return this.patientNoteService.getPatientNotesByPatientId(
        patientId,
      );
    }

    @Get('getPatientNoteBySendToId/:sendTo')
    getPatientNoteBySendToId(
      @Param('sendTo', ParseIntPipe) sendTo: number,
    ) {
      return this.patientNoteService.getPatientNoteBySendToId(
        sendTo,
      );
    }

    @Get('getPatientNotesByRequestId/:id')
    getPatientNotesByRequestId(
      @Param('id', ParseIntPipe) requestId: number,
    ) {
      return this.patientNoteService.getPatientNotesByRequestId(
        requestId,
      );
    }
    @Post()
    createPatientNote(
      @Body() dto: PatientNoteDTO,
    ) {
      return this.patientNoteService.createPatientNote(
        dto,
      );
    }
  
    @Patch(':id')
    editPatientNoteById(
      @Param('id', ParseIntPipe) noteId: number,
      @Body() dto: PatientNoteDTO,
    ) {
      return this.patientNoteService.editPatientNoteById(
        noteId,
        dto,
      );
    }
  
    @Roles('canDelete')
    @UseGuards(RolesGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deletePatientNoteById(
      @Param('id', ParseIntPipe) noteId: number,
    ) {
      return this.patientNoteService.deletePatientNoteById(
        noteId,
      );
    }
  }