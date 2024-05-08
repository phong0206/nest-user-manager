import { Controller, HttpException, HttpStatus, Post, Put, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
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
    const img = await this.imagesService.uploadAvatar({ ...req.file, userId: userId })
    throw new HttpException({
      status: HttpStatus.ACCEPTED,
      message: 'Upload avatar successfully',
      img
    }, HttpStatus.ACCEPTED);
  }

  @UseGuards(JwtAuthGuard)
  @Post('images-blog')
  @UseInterceptors(FilesInterceptor('files', 12, uploadMultipleImageBlog))
  async uploadImgsBlog(@UploadedFiles() files: Express.Multer.File[], @Req() req, @Res() res) {
    const data = files.map(file => ({ ...file, userId: req.user.id }));
    console.log(123123, data)
    const imgs = await this.imagesService.uploadMultipleImageBlogPost(data)
    throw new HttpException({
      status: HttpStatus.ACCEPTED,
      message: 'Upload images blog successfully',
      imgs
    }, HttpStatus.ACCEPTED);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-blogid')
  async updateBlogId(@Req() req, @Res() res) {
    const {imgIds, blogId} = req.body
    await this.imagesService.updateBlogIdImages(imgIds, blogId)
    throw new HttpException({
      status: HttpStatus.ACCEPTED,
      message: 'Update id blog successfully',
    }, HttpStatus.ACCEPTED);
  }

}
