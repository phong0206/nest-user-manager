import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from "../auth/auth.service"
import { JwtService } from '@nestjs/jwt';
import { RedisModule } from "../redis/redis.module"
import { RedisService } from "../redis/redis.service"
import { UserMethodDB } from "./user.methodDB"
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisModule, BullModule.registerQueue({
    name: 'email_sending',
  })],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService, RedisService, UserMethodDB]
})
export class UsersModule { }
