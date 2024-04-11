// jwt-auth.guard.ts
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from "../../config/constants"
import { RedisService } from "../../redis/redis.service"

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private redisService: RedisService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        try {
            const authHeader = request.headers.authorization;
            if (!authHeader) throw new UnauthorizedException('Auth header is missing.');

            const [bearer, token] = authHeader.split(' ');
            if (bearer !== 'Bearer' || !token) {
                throw new UnauthorizedException('Invalid token format.');
            }
            const decoded = this.jwtService.verify(token, { secret: JWT_SECRET_KEY });
            if (!decoded) {
                throw new UnauthorizedException('Invalid token.');
            }
            // check token blacklist
            const isBlacklisted = await this.redisService.isTokenBlacklisted(decoded);
            if (isBlacklisted) {
                throw new UnauthorizedException('Token is blacklisted');
            }
            request.user = decoded;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized access.', error.message);
        }
    }
}