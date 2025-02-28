import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { LoggerService } from 'src/modules/logger/logger.service';

@Injectable()
export class RegisterGuard implements CanActivate {
    constructor(private readonly logger: LoggerService) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.log('RegisterGuard Check');
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = authorization.split(' ')[1];
    const apiToken = process.env.API_TOKEN;

    if (token !== apiToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    this.logger.log('RegisterGuard Check Passed');
    return true;
  }
}