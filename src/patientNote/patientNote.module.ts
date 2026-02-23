import { Module } from '@nestjs/common';
import { patientNoteController } from './patientNote.controller';
import { patientNoteService } from './patientNote.service';

@Module({
    controllers:[patientNoteController],
    providers:[patientNoteService]
})
export class PatientNoteModule {}
