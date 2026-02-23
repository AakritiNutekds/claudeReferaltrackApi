import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { SmsService } from './sms.service';

@UseGuards(JwtGuard)
@Controller('messaging')
export class SmsController {
    constructor(
        private smsService: SmsService,
    ) { }

    @Post('send-sms')
    async bookAppointment(
        @Query('message') message: string,
        @Query('phone') phonenumber: string,
    ) {
        await this.smsService.sendSms(
            phonenumber,
            message
        );
        return { message: 'Appointment booked and SMS sent.' };
    }

    @Post('webhook')
    async handleIncomingSms(@Body() body: any) {
        const from = body.From;
        const message = body.Body?.trim().toLowerCase();

        if (message === 'c') {
            // Handle confirmation logic here
            await this.smsService.confirmAppointment(from);
        }

        return ''; // Twilio expects a 200 OK with empty body (or XML)
    }
}