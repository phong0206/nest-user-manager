import { Controller, HttpException, HttpStatus, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
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
        const newBlog = await this.blogsService.uploadBlog(req)
        throw new HttpException({
            status: HttpStatus.ACCEPTED,
            message: 'Upload blog successfully',
            newBlog
        }, HttpStatus.ACCEPTED);
    }

}
