import { Module } from '@nestjs/common';
import { insuranceController } from './insurance.controller';
import { insuranceService } from './insurance.service';

@Module({
    controllers:[insuranceController],
    providers:[insuranceService]
})
export class InsuranceModule {}
