import { Injectable } from '@nestjs/common';
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
    const dataBlog = req.body
    console.log(2313, req.files)
  }
}
