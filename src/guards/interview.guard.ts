import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class InterviewGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthorizedException('Unauthorized');
      }

      const interviewToken = authorization.split(' ')[1];

      if (!interviewToken) {
        throw new UnauthorizedException('Unauthorized');
      }
      this.jwtService.verify(interviewToken);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
