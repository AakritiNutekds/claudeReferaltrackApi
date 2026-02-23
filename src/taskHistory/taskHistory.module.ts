import { Module } from '@nestjs/common';
import { taskHistoryController } from './taskHistory.controller';
import { taskHistoryService } from './taskHistory.service';

@Module({
    controllers:[taskHistoryController],
    providers:[taskHistoryService]
})
export class TaskhistoryModule {}
