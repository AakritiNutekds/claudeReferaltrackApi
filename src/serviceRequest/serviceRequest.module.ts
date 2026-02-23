import { Module } from '@nestjs/common';
import { serviceRequestController } from './serviceRequest.controller';
import { serviceRequestService } from './serviceRequest.service';

@Module({
    controllers:[serviceRequestController],
    providers:[serviceRequestService]
})
export class ServiceRequestModule {}
