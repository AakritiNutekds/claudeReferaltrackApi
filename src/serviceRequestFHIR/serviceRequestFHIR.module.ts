import { Module } from '@nestjs/common';
import { serviceRequestFHIRController } from './serviceRequestFHIR.controller';
import { serviceRequestFHIRService } from './serviceRequestFHIR.service';

@Module({
    controllers:[serviceRequestFHIRController],
    providers:[serviceRequestFHIRService]
})
export class ServiceRequestFHIRModule {}
