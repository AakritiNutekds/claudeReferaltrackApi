import { Module } from '@nestjs/common';
import { patientProviderController } from './patientProvider.controller';
import { patientProviderService } from './patientProvider.service';

@Module({
    controllers:[patientProviderController],
    providers:[patientProviderService]
})
export class PatientProviderModule {}
