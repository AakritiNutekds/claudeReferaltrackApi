import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { serviceRequestFHIRService } from './serviceRequestFHIR.service';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('serviceRequestFHIRs')
export class serviceRequestFHIRController {
  constructor(
    private serviceRequestFHIRService: serviceRequestFHIRService,
  ) { }

  @Post()
  async createServiceRequest(
    @Body() response: any,
  ) {
    try {
      const totalStatus = await this.serviceRequestFHIRService.createServiceRequestFHIR(response);
      return totalStatus;
    } catch (error) {
      console.error('Error in createServiceRequest:', error);
      throw new InternalServerErrorException('Error processing service request');
    }
  }
  @Post('middleWareServiceRequests')
  async middleWareServiceRequests(
    @Body() response: any,
  ) {
    try {
      return await this.serviceRequestFHIRService.createServiceRequestMiddleware(response);
    } catch (error) {
      console.error('Error in createServiceRequest:', error);
      throw new InternalServerErrorException('Error processing service request');
    }
  }
}