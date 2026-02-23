import { Module } from '@nestjs/common';
import { priorityController } from './priority.controller';
import { priorityService } from './priority.service';

@Module({
    controllers:[priorityController],
    providers:[priorityService]
})
export class PriorityModule {}
