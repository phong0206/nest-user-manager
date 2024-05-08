import { Controller, Post, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadAvatar } from "./middleware/upload.middleware.avatar"
import { uploadMultipleImageBlog } from "./middleware/upload.middleware.blog"
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ImagesService } from './images.service';
@Controller('upload')
export class ImagesController {

  constructor(
    private readonly imagesService: ImagesService,
  ) { }
  @UseGuards(JwtAuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar', uploadAvatar))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req, @Res() res) {
    const userId = req.user.id
    await this.imagesService.uploadAvatar({ ...req.file, userId: userId })
    res.send(file);
  }

  @Post('images-blog')
  @UseInterceptors(FilesInterceptor('file', 12, uploadMultipleImageBlog))
  async uploadImgsBlog(@UploadedFiles() files: Express.Multer.File[], @Req() req, @Res() res) {
    await this.imagesService.uploadMultipleImageBlogPost(files)
    res.send(files);
  }

}
