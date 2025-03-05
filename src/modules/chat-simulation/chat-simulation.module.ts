import { Module } from '@nestjs/common';
import { ChatSimulationService } from './chat-simulation.service';
import { ChatSimulationController } from './chat-simulation.controller';
import { LoggerModule } from '../logger/logger.module';
import { ChatSimulationRepository } from './chat-simulation.repository.interface';
import { ChatSimulationPrismaRepository } from './prisma/chat-simulation.prisma.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from '../mail/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisProxy } from 'src/proxies/redis.proxy';
import { AgentProxy } from 'src/proxies/agent.proxy';
@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    MailModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [ChatSimulationController],
  providers: [
    ChatSimulationService,
    {
      provide: ChatSimulationRepository,
      useClass: ChatSimulationPrismaRepository,
    },
    RedisProxy,
    AgentProxy
  ],
})
export class ChatSimulationModule {}
