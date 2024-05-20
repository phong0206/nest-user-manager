import {
  Injectable, HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserMethodDB } from '../users/user.methodDB';
import { User } from "../users/user.entity"
const bcrypt = require("bcryptjs");
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY, APP_URL } from '../config/constants';
import { RegisterDto } from "./dtos/auth.dto"
import { RedisService } from "../redis/redis.service"
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
// import * as crypto from "crypto"
import { ResponseService } from '../response/response.service';


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

    @InjectQueue('email_sending')
    private readonly emailQueue: Queue,

    private readonly responseService: ResponseService,

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
    if (!user) throw new HttpException({ message: "Email incorrect" }, HttpStatus.BAD_REQUEST)
    const checkPass = await this.comparePassword(password, user.password);
    if (!checkPass) throw new HttpException({ message: "Password incorrect" }, HttpStatus.BAD_REQUEST)
    return user;
  }

  async logout(res: any, req: any) {
    await this.redisService.addToBlacklist(req.user.jti)
    return this.responseService.successResponse(res, 'Logout successfully')
  }

  async login(res, user: User) {
    const { password, ...userData } = user
    if (user.isActive === false) {
      const activeToken = await this.jwtService.sign({ id: user.id }, {
        secret: process.env.JWT_SECRET_KEY,
        algorithm: 'HS256',
        expiresIn: '24h'
      });
      await this.redisService.setCaching(`active-${user.id}`, activeToken, 86400);


      await this.emailQueue.add({
        to: user.email, subject: "Active account", template: './active-account', context: {
          name: user.name.first || user.email,
          verificationLink: `${APP_URL}/active-user?token=${activeToken}`
        }
      });
      return this.responseService.ErrorResponse(res, 'Your account is not active. Please, check email to active your account!')

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
    return this.responseService.successResponseWithData(res, 'Your account is not active. Please, check email to active your account!', {
      access_token,
      userData
    })

  }


  async register(res: any, input: RegisterDto) {
    if (input.isActive || input.isAdmin) return this.responseService.ErrorResponse(res, "Don't have field isAdmin and isActive")

    const checkEmailExists = await this.userMethodDB.findOneByData({ email: input.email });
    if (checkEmailExists) return this.responseService.ErrorResponse(res, "User already exists")

    input.password = await this.hashPassword(input.password);
    const user = await this.userMethodDB.create(input);
    const { password, ...userData } = user

    const activeToken = await this.jwtService.sign({ id: user.id }, {
      secret: process.env.JWT_SECRET_KEY,
      algorithm: 'HS256',
      expiresIn: '24h'
    });
    await this.redisService.setCaching(`active-${user.id}`, activeToken, 86400);


    await this.emailQueue.add({
      to: user.email, subject: "Active account", template: './active-account', context: {
        name: user.name.first || user.email,
        verificationLink: `${APP_URL}/active-user?token=${activeToken}`
      }
    });
    return this.responseService.successResponseWithData(res, 'Created account successfully. Please check mail to active account.', { user: userData })

  }

  async activeAccount(res: any, token: string) {
    const decodedToken = await this.jwtService.verify(token);
    if (!decodedToken) {
      return this.responseService.ErrorResponse(res, 'Verification failed');
    }

    const { id } = decodedToken;
    const cachedToken = await this.redisService.getCaching(`active-${id}`);
    if (token !== cachedToken) {
      return this.responseService.ErrorResponse(res, 'Invalid or expired reset token.');
    }

    const user = await this.userMethodDB.findById(id);
    if (user.isActive) {
      return this.responseService.successResponse(res, 'User is already activated');
    }
    await this.userMethodDB.update(id, { isActive: true });
    await this.redisService.delCaching(`active-${id}`);

    return this.responseService.successResponse(res, 'User activated successfully');
  }


  async sendRequestPasswordLink(res: any, email: string) {
    const user = await this.userMethodDB.findOneByData({ email });
    if (!user) {
      return this.responseService.ErrorResponse(res, 'User not found')
    }

    const resetToken = await this.jwtService.sign({ id: user.id }, {
      expiresIn: "5 minutes",
      secret: process.env.JWT_SECRET_KEY,
      algorithm: 'HS256',
    });


    await this.redisService.setCaching(`reset-${user.id}`, resetToken, 300);

    await this.emailQueue.add({
      to: user.email, subject: "Verify reset password", template: './verifyMailToGetNewPassword', context: {
        name: user.name.first || user.email,
        linkverify: `${APP_URL}/set-password?token=${resetToken}`
      }
    });
    return this.responseService.successResponseWithData(res, 'Email sent successfully', resetToken)
  }

  async validateResetToken(res: any, body: { password: string, token: string }) {
    const { token, password } = body;

    const decodedToken = await this.jwtService.verify(token);
    if (!decodedToken) {
      return this.responseService.ErrorResponse(res, 'Verification failed')
    }

    const { id } = decodedToken;
    const cachedToken = await this.redisService.getCaching(`reset-${id}`);
    if (token !== cachedToken) {
      return this.responseService.ErrorResponse(res, 'Invalid or expired reset token.')
    }

    const user = await this.userMethodDB.findById(id);
    const checkPass = await this.comparePassword(password, user.password);
    if (checkPass) {
      return this.responseService.ErrorResponse(res, 'The new password matches the old password. Please set another password.')
    }

    await this.redisService.delCaching(id);

    const hashPass = await this.hashPassword(password);
    await this.userMethodDB.update(id, { password: hashPass })
    return this.responseService.successResponse(res, 'Reset password successfully')
  }
}
