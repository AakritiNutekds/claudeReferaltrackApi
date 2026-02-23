import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SmsService } from './sms.service';

@Injectable()
export class ReminderService {
  constructor(
    private smsService: SmsService
  ) {}

  // @Cron(CronExpression.EVERY_DAY_AT_10AM) 
  // async sendReminders() {

  //     const message = `Reminder: You have an appointment tomorrow at `;
  //     await this.smsService.sendSms('+918700141772', message);
  //   }
  }