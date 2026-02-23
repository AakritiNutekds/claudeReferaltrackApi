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
  import { JwtGuard } from '../auth/guard';
  import { TenantGuard } from '../common/guards/tenant.guard';
  import { serviceRequestHistoryService } from './serviceRequestHistory.service';
  import {
    ServiceRequestHistoryDto
  } from './dto';

  @SetMetadata('auditResource', 'serviceRequestHistory')
  @UseGuards(JwtGuard, TenantGuard)
  @Controller('serviceRequestHistories')
  export class serviceRequestHistoryController {
    constructor(
      private serviceRequestHistoryService: serviceRequestHistoryService,
    ) {}
  
    @Get()
    getServiceRequestHistorys() {
      return this.serviceRequestHistoryService.getServiceRequestHistorys(
      );
    }
  
    @Get(':id')
    getServiceRequestHistoryById(
      @Param('id', ParseIntPipe) historyId: number,
    ) {
      return this.serviceRequestHistoryService.getServiceRequestHistoryById(
        historyId,
      );
    }
    @Get('getLastServiceRequestHistoryByRequestId/:id')
    getLastServiceRequestHistoryByRequestId(
      @Param('id', ParseIntPipe) requestId: number,
    ) {
      return this.serviceRequestHistoryService.getLastServiceRequestHistoryByRequestId(
        requestId,
      );
    }
  
    @Post()
    createServiceRequestHistory(
      @Body() dto: ServiceRequestHistoryDto,
    ) {
      return this.serviceRequestHistoryService.createServiceRequestHistory(
        dto,
      );
    }
  
    @Patch(':id')
    editServiceRequestHistoryById(
      @Param('id', ParseIntPipe) historyId: number,
      @Body() dto: ServiceRequestHistoryDto,
    ) {
      return this.serviceRequestHistoryService.editServiceRequestHistoryById(
        historyId,
        dto,
      );
    }
  
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteServiceRequestHistoryById(
      @Param('id', ParseIntPipe) historyId: number,
    ) {
      return this.serviceRequestHistoryService.deleteServiceRequestHistoryById(
        historyId,
      );
    }
  }