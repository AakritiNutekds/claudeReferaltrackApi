import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';
import { ReminderService } from './reminder.service';

@Module({
    controllers:[SmsController],
    providers:[SmsService],
})
export class SmsModule {}
