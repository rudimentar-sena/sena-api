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
  @IsString()
  interviewToken: string;
}
