import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from '../logger/logger.service';
import { RequestInterceptor } from '../../interceptors/request/request.interceptor';
import { RequestContextModule } from '../request-context/request-context.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RequestContextModule,
    AuthModule,
    PrismaModule,
    MailModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule { }
