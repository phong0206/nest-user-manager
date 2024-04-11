import { InjectRepository } from '@nestjs/typeorm';
import { BaseQuery } from '../base-query';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

export class UserMethodDB extends BaseQuery<User> {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>) {
        super(userRepository);
    }
}
