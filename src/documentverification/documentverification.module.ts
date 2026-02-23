import { Module } from '@nestjs/common';
import { DocumentVerificationController } from './documentverification.controller';
import { DocumentVerificationService } from './documentverification.service';

@Module({
    controllers:[DocumentVerificationController],
    providers:[DocumentVerificationService]
})
export class DocumentVerificationModule {}
