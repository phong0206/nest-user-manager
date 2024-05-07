import { Injectable } from '@nestjs/common';
import { UserMethodDB } from "../users/user.methodDB"
import { ImageMethodDB } from './../images/image.methodDB'
import { BlogMethodDB } from './blog.methodDB';

@Injectable()
export class BlogsService {
    constructor(
        private readonly userMethodDB: UserMethodDB,
        private readonly imageMethodDB: ImageMethodDB,
        private readonly blogMethodDB: BlogMethodDB,

    ) {
    }
    async uploadBlog(req: any, files: any): Promise<any> {
        const userId = req.user.id


    }
}
