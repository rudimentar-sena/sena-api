import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MinLength, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsPhoneNumber()
  @IsOptional()
  phoneNumber?: string;

  @IsNumber()
  @IsNotEmpty()
  companyId: number;

  @IsEnum(['ADMIN', 'USER'])
  @IsOptional()
  role?: 'ADMIN' | 'USER' = 'USER';
} 