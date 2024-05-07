import { Controller, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { uploadMultipleImageBlog } from "../images/middleware/upload.middleware.blog"
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { BlogsService } from "./blogs.service"
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
@Controller('blog')
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('upload-blog')
    @UseInterceptors(FilesInterceptor('file', 12, uploadMultipleImageBlog))
    async uploadImgsBlog( @Req() req, @Res() res) {
        await this.blogsService.uploadBlog(req)
        res.send(req.files);
    }

}
