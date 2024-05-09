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
import { BullModule } from '@nestjs/bullmq';


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
    BullModule.forRootAsync({
      useFactory: () => ({
        connection: {
          host: process.env.REDIS_HOST,
          port: +process.env.REDIS_PORT,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'upload_images_processing',
    }),
    BullModule.registerQueue({
      name: 'email_sending',
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
  ],
  controllers: [],
  providers: []
})
export class AppModule { }
