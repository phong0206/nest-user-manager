import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { ImagesModule } from "./images/images.module";
import { DatabaseModule } from './database/database.module';
import * as Joi from '@hapi/joi'
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailModule } from './mail/mail.module';
import { FollowsModule } from './follows/follows.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { BullModule } from '@nestjs/bull';
import { ResponseModule } from './response/response.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      }
    }),
    BullModule.registerQueue({
      name: 'upload_images_processing',
    }),
    BullModule.registerQueue({
      name: 'email_sending',
      // processors: [{
      //   name: 'sendEmail',
      //   path: __dirname + '/queues/email.processor.ts',
      //   concurrency: 5  
      // }]
    }),
    MailerModule,
    UsersModule,
    BlogsModule,
    ImagesModule,
    DatabaseModule,
    AuthModule,
    RedisModule,
    MailModule,
    FollowsModule,
    CommentsModule,
    LikesModule,
    ResponseModule,
  ],
})
export class AppModule { }
