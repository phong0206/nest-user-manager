import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { NODEMAILER_EMAIL, NODEMAILER_PASS } from "../config/constants"
@Module({
    imports: [
        MailerModule.forRoot({

            transport: {
                host: 'smtp.gmail.com',
                secure: true,
                port: 465,
                auth: {
                    user: NODEMAILER_EMAIL,
                    pass: NODEMAILER_PASS,
                },
            },
            defaults: {
                from: '"No Reply" <noreply@example.com>',
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],

})
export class MailModule { }
