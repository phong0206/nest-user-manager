import {
    Injectable, HttpException,
    HttpStatus,
} from '@nestjs/common';
import { UserMethodDB } from '../users/user.methodDB';
import { User } from "../users/user.entity"
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
const bcrypt = require("bcryptjs");
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from '../config/constants';
import { RegisterDto } from "./dtos/auth.dto"
import { RedisService } from "../redis/redis.service"

@Injectable()
export class AuthService {
    private _options: any = {
        algorithm: 'HS256',
        expiresIn: "7 days"
    };
    private userMethodDB: UserMethodDB;

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private redisService: RedisService,


    ) {
        this.userMethodDB = new UserMethodDB(usersRepository);
    }

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 12);
    }

    async comparePassword(
        password: string,
        storePasswordHash: string,
    ): Promise<any> {
        return await bcrypt.compare(password, storePasswordHash);
    }
    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userMethodDB.findOneByData({ email: email });
        if (!user) throw new HttpException({ message: 'Email incorrect' }, HttpStatus.BAD_REQUEST);
        const checkPass = await this.comparePassword(password, user.password);
        if (!checkPass) throw new HttpException({ message: 'Password incorrect' }, HttpStatus.BAD_REQUEST);
        return user;
    }

    async logout(req: any) {
        this.redisService.addToBlacklist(req.user.jti)
    }

    async login(user: User) {
        const { password, ...userData } = user
        const payload: any = {
            email: user.email,
            id: user.id,
            jti: uuidv4(),
        };
        const signOptions = {
            ...this._options,
            secret: JWT_SECRET_KEY
        };
        const access_token = await this.jwtService.sign(payload, signOptions);

        throw new HttpException({
            status: HttpStatus.ACCEPTED,
            message: 'Login successful',
            data: { access_token, userData }
        }, HttpStatus.ACCEPTED);
    }

    async register(input: RegisterDto) {
        if (input.isActive || input.isAdmin) throw new HttpException({ message: "Don't have field isAdmin and isActive" }, HttpStatus.BAD_REQUEST);

        const checkEmailExists = await this.userMethodDB.findOneByData({ email: input.email });
        if (checkEmailExists) throw new HttpException({ message: 'User already exists' }, HttpStatus.BAD_REQUEST);
        input.password = await this.hashPassword(input.password);
        return await this.userMethodDB.create(input);
    }
}