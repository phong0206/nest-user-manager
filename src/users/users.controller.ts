import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/users.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { LocalAuthGuard } from '../auth/guards/local.guard';
import { RedisService } from "../redis/redis.service"
import { AdminAuthGuard } from "../auth/guards/admin.guard"

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private redisService: RedisService,
    ) { }
    
    @UseGuards(JwtAuthGuard, AdminAuthGuard)
    @Post('create-user')
    async createUser(@Body() createUserDto: CreateUserDto) {
        await this.usersService.createUser(createUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('get-profile')
    async getProfile(@Request() request) {
        const userId = request.user.id
        await this.usersService.getProfile(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('delete-current-user')
    async deleteCurrentUser(@Request() request) {
        const userId = request.user.id
        this.redisService.addToBlacklist(request.user.jti)
        await this.usersService.deleteCurrentUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('update-current-user')
    async updateUser(@Request() request, @Body() data: any) {
        const userId = request.user.id
        await this.usersService.updateUser(userId, data);
    }
}
