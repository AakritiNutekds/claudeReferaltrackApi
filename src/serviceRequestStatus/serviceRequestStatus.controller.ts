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
  import { serviceRequestStatusService } from './serviceRequestStatus.service';
  import {
    ServiceRequestStatusDto,
  } from './dto';
  
  @UseGuards(JwtGuard)
  @Controller('serviceRequestStatuses')
  export class serviceRequestStatusController {
    constructor(
      private serviceRequestStatusService: serviceRequestStatusService,
    ) {}
  
    @Get()
    getServiceRequestStatuss() {
      return this.serviceRequestStatusService.getServiceRequestStatuss(
      );
    }
  
    @Get(':id')
    getServiceRequestStatusById(
      @Param('id', ParseIntPipe) statusId: number,
    ) {
      return this.serviceRequestStatusService.getServiceRequestStatusById(
        statusId,
      );
    }
    @Get('getServiceRequestStatusByValue/:value')
    getServiceRequestStatusByValue(
      @Param('value') value: string,
    ) {
      return this.serviceRequestStatusService.getServiceRequestStatusByValue(
        value,
      );
    }
  
    @Post()
    createServiceRequestStatus(
      @Body() dto: ServiceRequestStatusDto,
    ) {
      return this.serviceRequestStatusService.createServiceRequestStatus(
        dto,
      );
    }
  
    @Patch(':id')
    editServiceRequestStatusById(
      @Param('id', ParseIntPipe) statusId: number,
      @Body() dto: ServiceRequestStatusDto,
    ) {
      return this.serviceRequestStatusService.editServiceRequestStatusById(
        statusId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteServiceRequestStatusById(
      @Param('id', ParseIntPipe) statusId: number,
    ) {
      return this.serviceRequestStatusService.deleteServiceRequestStatusById(
        statusId,
      );
    }
  }