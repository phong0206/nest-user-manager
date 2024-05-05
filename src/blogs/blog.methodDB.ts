import { InjectRepository } from '@nestjs/typeorm';
import { BaseQuery } from '../base-query';
import { Blog } from './blog.entity';
import { Repository } from 'typeorm';

export class BlogMethodDB extends BaseQuery<Blog> {
    constructor(
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>) {
        super(blogRepository);
    }
}
