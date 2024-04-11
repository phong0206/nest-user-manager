import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserMethodDB } from '../../users/user.methodDB';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        private readonly userMethodDB: UserMethodDB
    ) {
    }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = await this.isValidUser(request.user);

        if (!user.isAdmin) {
            throw new UnauthorizedException('Only admins are allowed to perform this action.');
        }
        if (!user.isActive) {
            throw new UnauthorizedException('Your account is not active.');
        }

        return true;
    }

    private async isValidUser(user: any): Promise<any> {
        try {
            const userFromDB = await this.userMethodDB.findById(user.id);
            if (!userFromDB) {
                throw new Error("User doesn't exist.");
            }
            return userFromDB;
        } catch (error) {
            throw new UnauthorizedException('Unauthorized access.', error.message);
        }
    }
}