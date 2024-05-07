import {
    Injectable, HttpException,
    HttpStatus,
} from '@nestjs/common';
import { UserMethodDB } from '../users/user.methodDB';
import { User } from "../users/user.entity"
const bcrypt = require("bcryptjs");
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY, API_URL } from '../config/constants';
import { RegisterDto } from "./dtos/auth.dto"
import { RedisService } from "../redis/redis.service"
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    private _options: any = {
        algorithm: 'HS256',
        expiresIn: "7 days"
    };

    constructor(
        private readonly userMethodDB: UserMethodDB,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
        private readonly mailerService: MailerService
    ) {
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
        if (user.isActive === false) {

            await this.mailerService.sendMail({
                to: user.email, subject: "Active account", template: './active-account', context: {
                    name: user.name.first ||user.email,
                    verificationLink: `${API_URL}/auth/verify?userId=${user.id}`
                }
            })
            throw new HttpException({
                status: HttpStatus.ACCEPTED,
                message: 'Your account is not active. Please, check email to active your account!',
                user: userData
            }, HttpStatus.ACCEPTED);
        }
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
        const user = await this.userMethodDB.create(input);
        await this.mailerService.sendMail({
            to: input.email, subject: "Verify your email address", template: './active-account', context: {
                name: input.name.first ||input.email,
                verificationLink: `${API_URL}/auth/verify?userId=${user.id}`
            }
        })
        return user
    }

    async activeAccount(userId) {
        const user = await this.userMethodDB.findById(userId);
        if (user.isActive) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'Request invalid',
            }, HttpStatus.BAD_REQUEST);
        }
        await this.userMethodDB.update(userId, { isActive: true })
        throw new HttpException({ message: 'Active user successfully' }, HttpStatus.ACCEPTED);
    }

    async getNewPassword(email: string) {
        const user = await this.userMethodDB.findOneByData({ email: email });
        if (!user) {
            throw new HttpException({
                status: HttpStatus.BAD_REQUEST,
                message: 'User is not exists',
            }, HttpStatus.BAD_REQUEST);
        }
        const newPass = crypto.randomBytes(10).toString('hex').substr(0, 10);
        const hashPass = await this.hashPassword(newPass);

        await this.userMethodDB.update(user.id, { password: hashPass })
        await this.mailerService.sendMail({
            to: user.email, subject: "Get new password", template: './getNewPassword', context: {
                name: user.name.first || user.email,
                newPassword: newPass
            }
        })

    }
}