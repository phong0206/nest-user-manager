import { IsNotEmpty, IsEmail, MinLength, IsOptional, IsBoolean, IsString, IsNumber, Min, Max, ValidateNested, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class NameDto {
  @IsString()
  @MinLength(3, { message: "First name must be at least 3 characters long" })
  first: string;

  @IsString()
  @MinLength(3, { message: "Last name must be at least 3 characters long" })
  last: string;
}

export class RegisterDto {

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: "Email must be at least 6 characters long" })
  password: string;

  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @ValidateIf(o => o.age != null)
  @IsNumber({}, { message: "Age must be a number" })
  @Min(0, { message: "Age must be at least 0" })
  @Max(100, { message: "Age must not exceed 100" })
  age: number | null;


  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}




export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}