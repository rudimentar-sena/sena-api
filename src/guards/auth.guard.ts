import {
  CanActivate,
  ExecutionContext,
  Injectable,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('AuthGuard Check');

    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const { valid } = await this.authService.validateToken(authorization);
      return valid;
    } catch (error) {
      this.logger.error(`AuthGuard Error: ${error.message}`);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
