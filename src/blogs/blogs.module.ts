import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { UserMethodDB } from "../users/user.methodDB"
import { ImageMethodDB } from '../images/image.methodDB'
import { BlogMethodDB } from "../blogs/blog.methodDB"
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Image } from '../images/image.entity';
import { Blog } from './blog.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from "../redis/redis.service"
import { RedisModule } from "../redis/redis.module"


@Module({
  imports: [TypeOrmModule.forFeature([User, Image, Blog]), RedisModule
  ],
  controllers: [BlogsController],
  providers: [BlogsService, UserMethodDB, ImageMethodDB, BlogMethodDB, JwtService, RedisService]
})
export class BlogsModule { }
