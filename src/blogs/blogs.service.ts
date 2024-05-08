import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserMethodDB } from "../users/user.methodDB"
import { ImageMethodDB } from './../images/image.methodDB'
import { BlogMethodDB } from './blog.methodDB';

interface dataBlog {
  title?: string,
  content?: string,

}
@Injectable()
export class BlogsService {
  constructor(
    private readonly userMethodDB: UserMethodDB,
    private readonly blogMethodDB: BlogMethodDB,

  ) {
  }

  async uploadBlog(req: any): Promise<any> {
    const userId = req.user.id
    const user = await this.userMethodDB.findById(userId)
    if (!user) {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        message: 'User does not exists',
      }, HttpStatus.NOT_FOUND);
    }
    const dataBlog = req.body
    return await this.blogMethodDB.create({ ...dataBlog, userId: userId, author: (user.name.first + user.name.last) || user.email })
  }
}
