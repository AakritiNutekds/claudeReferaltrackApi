import { Module } from '@nestjs/common';
import { taskBusinessStatusController } from './taskBusinessStatus.controller';
import { taskBusinessStatusService } from './taskBusinessStatus.service';

@Module({
    controllers:[taskBusinessStatusController],
    providers:[taskBusinessStatusService]
})
export class TaskBusinessStatusModule {}
