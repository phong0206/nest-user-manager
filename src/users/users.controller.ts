import { Body, Controller, Get, Param, Post, Delete, UseGuards } from '@nestjs/common';
import User from "./user.entity"
import { UsersService } from './users.service';
import { CreateUserDto } from './users.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Post('register')
    async createUser(@Body() createUserDto: CreateUserDto) {
        const newUser = await this.usersService.createUser(createUserDto);
        return newUser;
    }
}
