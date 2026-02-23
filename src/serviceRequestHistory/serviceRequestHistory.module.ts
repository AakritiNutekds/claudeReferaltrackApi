import { Module } from '@nestjs/common';
import { serviceRequestHistoryController } from './serviceRequestHistory.controller';
import { serviceRequestHistoryService } from './serviceRequestHistory.service';

@Module({
    controllers:[serviceRequestHistoryController],
    providers:[serviceRequestHistoryService]
})
export class ServiceRequestHistoryModule {}
