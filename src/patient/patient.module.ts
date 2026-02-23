import { Module } from '@nestjs/common';
import { patientController } from './patient.controller';
import { patientService } from './patient.service';
import {compressImageService} from '../compressImage/compressImgae.service'

@Module({
    controllers:[patientController],
    providers:[patientService, compressImageService]
})
export class PatientModule {}
