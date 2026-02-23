import { Module } from '@nestjs/common';
import { patientDocumentController } from './patientDocument.controller';
import { patientDocumentService } from './patientDocument.service';

@Module({
    controllers:[patientDocumentController],
    providers:[patientDocumentService]
})
export class PatientDocumentModule {}
