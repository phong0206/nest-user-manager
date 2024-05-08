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

  async uploadMultipleImageBlogPost(data: any[]) {
    return await this.imageMethodDB.insertMany(data)
  }

  async uploadAvatar(data: any) {
    return await this.imageMethodDB.create(data)
  }

  async updateBlogIdImages(imgIds: Array<string>, blogId: string){
    await this.imageMethodDB.setBlogIdForImages(imgIds, blogId)
  }




}
