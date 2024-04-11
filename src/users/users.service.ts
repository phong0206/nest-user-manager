import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserMethodDB } from './user.methodDB';
import { CreateUserDto } from './dto/users.dto';
import { AuthService } from "../auth/auth.service"
@Injectable()
export class UsersService {
    constructor(
        private readonly userMethodDB: UserMethodDB,
        private readonly authService: AuthService
    ) {
    }

    async createUser(createUserDto: CreateUserDto) {
        const checkUser = await this.userMethodDB.findOneByData({ email: createUserDto.email });
        if (checkUser) throw new HttpException({ message: 'User alrady exists' }, HttpStatus.BAD_REQUEST);
        createUserDto.password = await this.authService.hashPassword(createUserDto.password)
        const newUser = await this.userMethodDB.create(createUserDto)
        const { password, ...userData } = newUser

        throw new HttpException({
            status: HttpStatus.ACCEPTED,
            message: 'Create new user successfully',
            data: { additional: userData }
        }, HttpStatus.ACCEPTED);

    }
    async getProfile(userId: string) {
        const userData = await this.userMethodDB.findById(userId);
        if (!userData) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: "User don't exist",
            }, HttpStatus.BAD_REQUEST)
        }
        const { password, ...user } = userData

        throw new HttpException({
            status: HttpStatus.ACCEPTED,
            message: 'Get profile successfully',
            data: { user }
        }, HttpStatus.ACCEPTED);
    }

    async deleteCurrentUser(userId: string) {
        await this.userMethodDB.deleteById(userId);
        throw new HttpException({
            status: HttpStatus.ACCEPTED,
            message: 'Delete successfully',
        }, HttpStatus.ACCEPTED);
    }

    async updateUser(userId: string, data: any) {
        const userData = await this.userMethodDB.findById(userId);
        if (!userData) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: "User don't exist",
            }, HttpStatus.BAD_REQUEST)
        }
        await this.userMethodDB.update(userId, data)

        throw new HttpException({
            status: HttpStatus.ACCEPTED,
            message: 'Update successfully',
        }, HttpStatus.ACCEPTED);
    }

}

