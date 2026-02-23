import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('reset-password')
  async sendResetPasswordEmail(@Body('email') email: string, @Body('resetLink') resetLink: string): Promise<{ success: boolean }> {
    const isEmailSent = await this.emailService.sendResetPasswordEmail(email, resetLink);
    return { success: isEmailSent };
  }
  @Post('verify-email')
  async sendVerificationEmail(@Body('email') email: string, @Body('resetLink') resetLink: string): Promise<{ success: boolean }> {
    const isEmailSent = await this.emailService.sendVerificationEmail(email, resetLink);
    return { success: isEmailSent };
  }
}