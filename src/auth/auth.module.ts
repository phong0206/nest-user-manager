import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { User } from "../users/user.entity"
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY, EXPIRES_TIME_SECONDS } from "../config/constants"
import { RedisService } from "../redis/redis.service"
import { RedisModule } from "../redis/redis.module"
import { MailModule } from '../mail/mail.module';
import { UserMethodDB } from "../users/user.methodDB"
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from "../queues/email.processor"
import { ResponseModule } from '../response/response.module';
import { ResponseService } from '../response/response.service';
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'email_sending',
    }),
    RedisModule,
    ResponseModule,
    MailModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: EXPIRES_TIME_SECONDS },
    }),
  ],
  providers: [AuthService, LocalStrategy, RedisService, UserMethodDB, EmailProcessor, ResponseService],
  controllers: [AuthController],

})
export class AuthModule { }