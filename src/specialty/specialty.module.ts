import { Module } from '@nestjs/common';
import { specialtyController } from './specialty.controller';
import { specialtyService } from './specialty.service';

@Module({
    controllers:[specialtyController],
    providers:[specialtyService]
})
export class SpecialtyModule {}
