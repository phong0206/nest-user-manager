import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { EXPIRES_TIME_SECONDS } from "../config/constants"
import { AuthService } from "../auth/auth.service"
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from "../config/constants"

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private jwtService: JwtService

  ) { }
  private readonly authService: AuthService

  async addToBlacklist(jti: string) {
    try {
      if (jti) {
        await this.redisClient.set(`blacklist: ${jti}`, 'true', 'EX', EXPIRES_TIME_SECONDS);
        return true;
      } else {
        throw new HttpException({ message: 'Invalid token - unable to extract JTI.' }, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException({ message: 'Error blacklisting token: ' + error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  async isTokenBlacklisted(decoded: { jti: string }): Promise<boolean> {
    try {
      const isBlacklisted = await this.redisClient.get(`blacklist: ${decoded.jti}`);
      return isBlacklisted === 'true';
    } catch (error) {
      throw new HttpException({ message: 'Error checking if token is blacklisted: ' + error.message }, HttpStatus.BAD_REQUEST);

    }
  }

  async setCaching(key: string, value: string, expireSeconds: number) {
    await this.redisClient.set(key, value, 'EX', expireSeconds);
  }

  async getCaching(key: string) {
    return await this.redisClient.get(key);
  }

  async delCaching(key: string) {
    await this.redisClient.del(key)
  }
}
