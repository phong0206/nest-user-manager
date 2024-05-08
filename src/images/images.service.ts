import { Injectable } from '@nestjs/common';
import { UserMethodDB } from '../users/user.methodDB';
import { ImageMethodDB } from './image.methodDB';
import { BlogMethodDB } from '../blogs/blog.methodDB';

@Injectable()
export class ImagesService {
  constructor(
    private readonly userMethodDB: UserMethodDB,
    private readonly imageMethodDB: ImageMethodDB,
    private readonly blogMethodDB: BlogMethodDB,

  ) { }

  async uploadMultipleImageBlogPost(files: any[]) {
    this.imageMethodDB.insertMany(files)
  }

  async uploadAvatar(data: any) {
    console.log(12312, data)
    this.imageMethodDB.create(data)
  }




}
