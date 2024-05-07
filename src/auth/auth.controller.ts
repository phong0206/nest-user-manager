import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
    Query,
    Request,
    Response,
    UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from "./dtos/auth.dto"
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    async login(@Request() request): Promise<any> {
        return await this.authService.login(request.user);
    }

    @Post('/register')
    async registerUser(@Body() input: RegisterDto) {
        const user = await this.authService.register(input);
        const { password, ...userData } = user
        throw new HttpException({ message: 'Created account successfully. Please check mail to active account.', user: userData }, HttpStatus.ACCEPTED);

    }

    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    async getUserLogout(@Request() request): Promise<Response> {
        this.authService.logout(request)
        throw new HttpException({ message: 'Logout successfully' }, HttpStatus.ACCEPTED);
    }

    @Get('/verify')
    async activeUser(@Query() query): Promise<any> {
        await this.authService.activeAccount(query.userId)
    }

    @Post('/get-new-password')
    async getNewPassword(@Body() input: any): Promise<any> {
        await this.authService.getNewPassword(input.email)
    }

}
