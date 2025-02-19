import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signIn(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.authService.signIn(authorization);
  }

  @Get('validate')
  async validate(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('Unauthorized');
    }
    return this.authService.validateToken(authorization);
  }
}
