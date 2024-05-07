import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { RedisModule } from "../redis/redis.module"
import { RedisService } from "../redis/redis.service"
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [RedisModule],
  controllers: [ImagesController],
  providers: [ImagesService, RedisService, JwtService],

})
export class ImagesModule { }
