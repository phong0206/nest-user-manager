import { InjectRepository } from '@nestjs/typeorm';
import { BaseQuery } from '../base-query';
import { Image } from './image.entity';
import { Repository } from 'typeorm';
import { getConnection } from "typeorm";

export class ImageMethodDB extends BaseQuery<Image> {
    constructor(
        @InjectRepository(Image)
        private imageRepository: Repository<Image>) {
        super(imageRepository);
    }

    async setBlogIdForImages(imageIds: string[], blogId: string): Promise<void> {
        await this.imageRepository
            .createQueryBuilder()
            .update(Image)
            .set({ blogId: blogId })
            .where('id = ANY(:imageIds)', { imageIds })
            .execute();
    }
    
}
