import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger/logger.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthRepository } from './auth.repository.interface';
import { AuthPrismaRepository } from './prisma/auth-prisma.repository';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    PrismaModule,
  ],
  providers: [AuthService, {
    provide: AuthRepository,
    useClass: AuthPrismaRepository,
  }],
  controllers: [AuthController],

})
export class AuthModule { }
