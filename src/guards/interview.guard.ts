import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class InterviewGuard implements CanActivate {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request.headers.authorization;
      if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthorizedException('Unauthorized');
      }
      const interviewToken = authorization.split(' ')[1];
      console.log(interviewToken);

      if (!interviewToken) {
        throw new UnauthorizedException('Unauthorized');
      }
      this.jwtService.verify(interviewToken, {
        secret: process.env.JWT_SECRET,
      });
      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
