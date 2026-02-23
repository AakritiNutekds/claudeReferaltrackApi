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
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard, RolesGuard } from '../auth/guard';
import { GetUser, Roles } from '../auth/decorator';
import { TenantGuard } from '../common/guards/tenant.guard';
import { serviceRequestService } from './serviceRequest.service';
import {
  ServiceRequestDTO
} from './dto';

@SetMetadata('auditResource', 'serviceRequest')
@UseGuards(JwtGuard, TenantGuard)
@Controller('serviceRequests')
export class serviceRequestController {
  constructor(
    private serviceRequestService: serviceRequestService,
  ) { }

  @Get()
  getServiceRequests(@GetUser('organizationId') organizationId: number) {
    return this.serviceRequestService.getServiceRequests(organizationId);
  }

  @Get('getAllDraftRequestRequestForAgent')
  getAllDraftRequestRequestForAgent(@GetUser('organizationId') organizationId: number) {
    return this.serviceRequestService.getAllDraftRequestRequestForAgent(organizationId);
  }

  @Get('getAllBookedAppointmentsForAgent')
  getAllBookedAppointmentsForAgent(@GetUser('organizationId') organizationId: number) {
    return this.serviceRequestService.getAllBookedAppointmentsForAgent(organizationId);
  }

  @Get('getAllRequestForDocumentgVerficationAgent')
  getAllRequestForDocumentgVerficationAgent(@GetUser('organizationId') organizationId: number) {
    return this.serviceRequestService.getAllRequestForDocumentgVerficationAgent(organizationId);
  }

  @Get('getAllTodaysInboundRequestByUserId')
  getAllTodaysInboundRequestByUserId(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('userTimeZone') userTimeZone: string
  ) {
    console.log(userTimeZone);
    return this.serviceRequestService.getAllTodaysInboundRequestByUserId(
      userId,
      userTimeZone
    );
  }

  @Get('getThreeDaysAppointmentByUserId')
  getThreeDaysAppointmentByUserId(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('userTimeZone') userTimeZone: string
  ) {
    return this.serviceRequestService.getThreeDaysAppointmentByUserId(userId, userTimeZone);
  }


  @Get(':id')
  getServiceRequestById(
    @Param('id', ParseIntPipe) serviceRequestId: number,
  ) {
    return this.serviceRequestService.getServiceRequestById(
      serviceRequestId,
    );
  }

  @Get('getServiceRequestByAlternateId/:alternateId')
  getServiceRequestByAlternateId(
    @Param('alternateId') alternateId: string,
  ) {
    return this.serviceRequestService.getServiceRequestByAlternateId(
      alternateId,
    );
  }

  @Get('getAllInboundRequestByUserId/:userId')
  getAllInboundRequestByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.serviceRequestService.getAllInboundRequestByUserId(
      userId,
    );
  }


  @Get('getAllOutboundRequestByUserId/:userId')
  getAllOutboundRequestByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.serviceRequestService.getAllOutboundRequestByUserId(
      userId,
    );
  }

  @Get('getAllInboundRequestByUserIdAndStatusId/:userId/:statusId')
  getAllInboundRequestByUserIdAndStatusId(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('statusId', ParseIntPipe) statusId: number,
  ) {
    return this.serviceRequestService.getAllInboundRequestByUserIdAndStatusId(
      userId,
      statusId
    );
  }

  @Get('getAllOutboundRequestByUserIdAndStatusId/:userId/:statusId')
  getAllOutboundRequestByUserIdAndStatusId(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('statusId', ParseIntPipe) statusId: number,
  ) {
    return this.serviceRequestService.getAllOutboundRequestByUserIdAndStatusId(
      userId,
      statusId
    );
  }

  @Get('getAllRequestByPatientId/:patientId')
  getAllRequestByPatientId(
    @Param('patientId', ParseIntPipe) patientId: number,
  ) {
    return this.serviceRequestService.getAllRequestByPatientId(
      patientId,
    );
  }

  @Get('getAllRequestByPatientIdAndUserId/:patientId/:userId')
  getAllRequestByPatientIdAndUserId(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.serviceRequestService.getAllRequestByPatientIdAndUserId(
      patientId,
      userId
    );
  }

  @Get('getAllRelatedRequest/:patientId/:userId/:serviceRequestId')
  getAllRelatedRequest(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Param('serviceRequestId', ParseIntPipe) serviceRequestId: number,
  ) {
    return this.serviceRequestService.getAllRelatedRequest(
      patientId,
      userId,
      serviceRequestId
    );
  }

@Get('getAllPendingOutboundAppointmentsByUserId/:userId')
  getAllPendingOutboundAppointmentsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.serviceRequestService.getAllPendingOutboundAppointmentsByUserId(
      userId,
    );
  }

  @Get('getAllBookedOutboundAppointmentsByUserId/:userId')
  getAllBookedOutboundAppointmentsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.serviceRequestService.getAllBookedOutboundAppointmentsByUserId(
      userId,
    );
  }

  @Get('getAllPendingInboundAppointmentsByUserId/:userId')
  getAllPendingAppointmentsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.serviceRequestService.getAllPendingInboundAppointmentsByUserId(
      userId,
    );
  }

  @Get('getAllBookedInboundAppointmentsByUserId/:userId')
  getAllBookedInboundAppointmentsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.serviceRequestService.getAllBookedInboundAppointmentsByUserId(
      userId,
    );
  }

  @Post()
  createServiceRequest(
    @Body() dto: ServiceRequestDTO,
  ) {
    return this.serviceRequestService.createServiceRequest(
      dto,
    );
  }

  // @Post('middlewareResponse')
  // middlewareResponse(
  //   @Body() dto: any,
  // ) {
  //   return this.serviceRequestService.middlewareResponse(
  //     dto,
  //   );
  // }

  @Patch(':id')
  editServiceRequestById(
    @Param('id', ParseIntPipe) serviceRequestId: number,
    @Body() dto: ServiceRequestDTO,
  ) {
    return this.serviceRequestService.editServiceRequestById(
      serviceRequestId,
      dto,
    );
  }

  @Roles('canDelete')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteServiceRequestById(
    @Param('id', ParseIntPipe) serviceRequestId: number,
  ) {
    return this.serviceRequestService.deleteServiceRequestById(
      serviceRequestId,
    );
  }
}