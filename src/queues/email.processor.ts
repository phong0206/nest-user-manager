import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email_sending')
export class EmailProcessor {
  constructor(private mailerService: MailerService) { }

  @Process()
  async sendEmail(job: Job) {
    try {
      await this.mailerService.sendMail(job.data);
      console.log('Email sent to:', job.data.to);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
