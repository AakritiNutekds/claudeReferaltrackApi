import { Module } from '@nestjs/common';
import { serviceRequestStatusController } from './serviceRequestStatus.controller';
import { serviceRequestStatusService } from './serviceRequestStatus.service';

@Module({
    controllers:[serviceRequestStatusController],
    providers:[serviceRequestStatusService]
})
export class ServiceRequestStatusModule {}
