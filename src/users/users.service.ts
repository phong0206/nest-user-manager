import { Injectable } from '@nestjs/common';
import User from "./user.entity"
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './users.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) { }

    async createUser(createUserDto: CreateUserDto) {
        const newUser = await this.usersRepository.create(createUserDto);
        await this.usersRepository.save({
            email: createUserDto.email,
            password: createUserDto.password,
        });
        return newUser;
    }
}
