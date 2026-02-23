import { Module } from '@nestjs/common';
import { facilityController } from './facility.controller';
import { facilityService } from './facility.service';

@Module({
    controllers:[facilityController],
    providers:[facilityService]
})
export class FacilityModule {}
