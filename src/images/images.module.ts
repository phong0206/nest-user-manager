import { BlogMethodDB } from './../blogs/blog.methodDB';
import { ImageMethodDB } from './image.methodDB';
import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { RedisModule } from "../redis/redis.module"
import { RedisService } from "../redis/redis.service"
import { JwtService } from '@nestjs/jwt';
import { UserMethodDB } from "../users/user.methodDB"
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Image } from "./image.entity"
import { Blog } from '../blogs/blog.entity';


@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([User, Image, Blog])],
  controllers: [ImagesController],
  providers: [ImagesService, RedisService, JwtService, UserMethodDB, ImageMethodDB, BlogMethodDB],

})
export class ImagesModule { }
