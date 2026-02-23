import { Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { SmsModule } from './sms.module';
import { SmsService } from './sms.service';

@Module({
  providers: [ReminderService, SmsService],
})
export class ReminderModule {}
