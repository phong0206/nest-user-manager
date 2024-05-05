import { InjectRepository } from '@nestjs/typeorm';
import { BaseQuery } from '../base-query';
import { Image } from './image.entity';
import { Repository } from 'typeorm';

export class ImageMethodDB extends BaseQuery<Image> {
    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>) {
        super(imageRepository);
    }
}
