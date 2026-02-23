import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.1and1.com', // your SMTP server
        port: 587,
        secure: false,
        auth: {
          user: 'support@nutekds.com', // your email address
          pass: 'GreenAsh63+', // your email password
        },
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
