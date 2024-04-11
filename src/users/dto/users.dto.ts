import { IsNotEmpty, IsEmail, MinLength, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
    @IsOptional()
    @IsBoolean()
    isAdmin?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

}