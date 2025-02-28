import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterGuard } from 'src/guards/register.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(RegisterGuard)
  @Post('signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signIn(@Headers('authorization') authorization: string) {
    console.log('authorization', authorization);
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
