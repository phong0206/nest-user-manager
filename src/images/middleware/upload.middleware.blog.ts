import { Request } from 'express';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'blog_images/';
        // check folder exists  and create folder if it does not exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: Function) => {
        const fileExt = path.extname(file.originalname);
        cb(null, `${file.fieldname}-image-${Date.now()}${fileExt}`);
    },
});

function checkFileType(file: Express.Multer.File, cb: Function) {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images Only!!!'));
    }
}

export const uploadMultipleImageBlog: multer.Options = {
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
        checkFileType(file, cb);
    },
}

// export const uploadSingleImageBlog: multer.Options = {
//     storage,
//     limits: { fileSize: 5 * 1024 * 1024 },
//     fileFilter: (req: Request, file: Express.Multer.File, cb: Function) => {
//         checkFileType(file, cb);
//     },
// }
