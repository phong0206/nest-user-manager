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
import { ResponseService } from '../response/response.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly responseService: ResponseService,

  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() request, @Response() res): Promise<any> {
    try {
      const result = await this.authService.login(res, request.user);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('register')
  async registerUser(@Body() input: RegisterDto, @Response() res): Promise<any> {
    try {
      await this.authService.register(res, input);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async getUserLogout(@Request() req, @Response() res): Promise<any> {
    try {
      await this.authService.logout(res, req)
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Get('active-user')
  async activeUser(@Query() query, @Response() res): Promise<any> {
    try {
      await this.authService.activeAccount(res, query.token)
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('forgot-password')
  async sendRequestPasswordLink(@Body('email') email: string, @Response() res: any): Promise<any> {
    try {
      await this.authService.sendRequestPasswordLink(res, email);
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
    }
  }

  @Post('validate-reset-token-password')
  async validateResetToken(@Body() body: { password: string; token: string }, @Response() res: any) {
    try {
      await this.authService.validateResetToken(res, body);
    } catch (error) {
      return this.responseService.ErrorResponse(res, error.message);
    }
  }


}
