import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email_sending')
export class EmailProcessor {
  constructor(private mailerService: MailerService) { }

  @Process()
  async sendEmail(job: Job) {
    console.log(1231231,job.data)
    // const { to, subject, template, context } = job.data;
    // try {
    //   console.log('Sending email:', job.data);
    //   await this.mailerService.sendMail({
    //     to: to,
    //     subject: subject,
    //     template: template,
    //     context: context
    //   });
    //   console.log('Email sent to:', to);
    // } catch (error) {
    //   console.error('Error sending email:', error);
    //   throw error;
    // }
  }
}
