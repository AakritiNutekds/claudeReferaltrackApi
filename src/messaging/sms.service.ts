import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  }

  async sendSms(to: string, message: string): Promise<any> {
    return this.client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER, 
      to,
    });
  }

  async confirmAppointment(phoneNumber: string): Promise<void> {
  // Lookup appointment by phone number
  // Update status to "confirmed"
  console.log(`Appointment confirmed by ${phoneNumber}`);
}
}
