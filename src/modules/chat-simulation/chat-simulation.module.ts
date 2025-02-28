import { Module } from '@nestjs/common';
import { ChatSimulationService } from './chat-simulation.service';
import { ChatSimulationController } from './chat-simulation.controller';
import { LoggerModule } from '../logger/logger.module';
import { ChatSimulationRepository } from './chat-simulation.repository.interface';
import { ChatSimulationPrismaRepository } from './prisma/chat-simulation.prisma.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [LoggerModule, PrismaModule, MailModule, AuthModule, JwtModule],
  controllers: [ChatSimulationController],
  providers: [
    ChatSimulationService,
    {
      provide: ChatSimulationRepository,
      useClass: ChatSimulationPrismaRepository,
    },
  ],
})
export class ChatSimulationModule {}
