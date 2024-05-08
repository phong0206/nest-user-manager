import { Controller, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { BlogsService } from "./blogs.service"
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
@Controller('blog')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('upload-blog')
    async uploadImgsBlog( @Req() req, @Res() res) {
        await this.blogsService.uploadBlog(req)
        res.send(req.files);
    }

}
