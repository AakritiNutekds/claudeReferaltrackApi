import { Module } from '@nestjs/common';
import { serviceRequestLockController } from './serviceRequestLock.controller';
import { serviceRequestLockService } from './serviceRequestLock.service';

@Module({
    controllers:[serviceRequestLockController],
    providers:[serviceRequestLockService]
})
export class ServiceRequestLockModule {}
