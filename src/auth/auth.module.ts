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

@Module({
  imports: [
    RedisModule,
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: EXPIRES_TIME_SECONDS },
    }),
  ],
  providers: [AuthService, LocalStrategy, RedisService ],
  controllers: [AuthController],

})
export class AuthModule { }