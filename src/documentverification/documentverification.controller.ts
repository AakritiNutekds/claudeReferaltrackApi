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
  import {
    DocumentVerificationDto,
  } from './dto';
import { DocumentVerificationService } from './documentverification.service';
  
  @UseGuards(JwtGuard)
  @Controller('documentVerifications')
  export class DocumentVerificationController {
    constructor(
      private documentVerificationService: DocumentVerificationService,
    ) {}
  
    @Get()
    getDocumentVerifications() {
      return this.documentVerificationService.getDocumentVerifications(
      );
    }
  
    @Get(':id')
    getDocumentVerificationById(
      @Param('id', ParseIntPipe) verificationId: number,
    ) {
      return this.documentVerificationService.getDocumentVerificationById(
        verificationId,
      );
    }

    @Get('getAllDocumentsByServiceRequestId/:serviceRequestId')
    getAllDocumentsByServiceRequestId(
      @Param('serviceRequestId', ParseIntPipe) serviceRequestId: number,
    ) {
      return this.documentVerificationService.getAllDocumentsByServiceRequestId(
        serviceRequestId,
      );
    }
  
    @Post()
    createDocumentVerification(
      @Body() dto: DocumentVerificationDto,
    ) {
      return this.documentVerificationService.createDocumentVerification(
        dto,
      );
    }
  
    @Patch(':id')
    editDocumentVerificationById(
      @Param('id', ParseIntPipe) verificationId: number,
      @Body() dto: DocumentVerificationDto,
    ) {
      return this.documentVerificationService.editDocumentVerificationById(
        verificationId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteDocumentVerificationById(
      @Param('id', ParseIntPipe) verificationId: number,
    ) {
      return this.documentVerificationService.deleteDocumentVerificationById(
        verificationId,
      );
    }
  }