import { Controller, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadAvatar } from "./middleware/upload.middleware.avatar"
import { uploadMultipleImageBlog } from "./middleware/upload.middleware.blog"
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('upload')
export class ImagesController {
    @UseGuards(JwtAuthGuard)
    @Post('avatar')
    @UseInterceptors(FileInterceptor('file', uploadAvatar))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req, @Res() res) {
        console.log(file);
        res.send(file);
    }

    @Post('images-blog')
    @UseInterceptors(FilesInterceptor('file', 12, uploadMultipleImageBlog))
    async uploadImgsBlog(@UploadedFiles() files: Express.Multer.File[], @Req() req, @Res() res) {
        console.log(files);
        res.send(files);
    }

}
