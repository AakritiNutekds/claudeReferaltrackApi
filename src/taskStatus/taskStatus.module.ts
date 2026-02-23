import { Module } from '@nestjs/common';
import { taskStatusController } from './taskStatus.controller';
import { taskStatusService } from './taskStatus.service';

@Module({
    controllers:[taskStatusController],
    providers:[taskStatusService]
})
export class TaskStatusModule {}
