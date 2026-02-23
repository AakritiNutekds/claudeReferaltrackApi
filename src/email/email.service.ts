import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordEmail(email: string, resetLink: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Referral Track Password',
        html: `<html>
        <head>
            <meta charset="UTF-8">
            <title>Password Reset Request</title>
        </head>
        <body>
        <p>Hi, </p>
            <p>It seems like you forgot your password for Referral Track website. Click the link below to reset your password.</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you did not forget your password, please disregard this email.</p>
        </body>
        </html>`,
      });
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
  async sendVerificationEmail(email: string, resetLink: string): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Email verification - Referral Track',
        html: `<html>
        <head>
            <meta charset="UTF-8">
            <title>Password Reset Request</title>
        </head>
        <body>
        <p>Hi, </p>
            <p>Please click the link below to verify your email.</p>
            <a href="${resetLink}">Verify Email</a>
            <p>If you did not created account on referral track, please disregard this email.</p>
        </body>
        </html>`,
      });
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}