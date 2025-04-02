import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateChatSimulationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string;
  @IsString()
  description?: string;
  @IsEmail()
  targetUserEmail: string;
  @IsNumber()
  companyId: number;
  @IsNumber()
  creatorId: number;
  @IsString()
  interviewCode: string;
}

export class MessageDto {
  @IsString()
  message: string;
  @IsString()
  chatId: string;
}

export class UserDto {
  @IsNumber()
  id: number;
  @IsEmail()
  email: string;
  @IsString()
  name: string;
  @IsNumber()
  companyId: number;
  @IsString()
  role: string;
}

export class UpdateSimulationDto {
  @IsString()
  id: string;
  @IsString()
  title: string;
  @IsString()
  description: string;
}
