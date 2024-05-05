import { Controller, Post, Req, Res, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadAvatar } from "./middleware/upload.middleware.avatar"
@Controller('upload')
export class ImagesController {

    @Post('avatar')
    @UseInterceptors(FileInterceptor('file', uploadAvatar))
    async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: Request, @Res() res: Response) {
        console.log(file);
        res.send(file);
    }

}
