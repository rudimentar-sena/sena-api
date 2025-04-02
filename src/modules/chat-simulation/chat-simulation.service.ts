import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { CreateChatSimulationDto, MessageDto, UserDto, UpdateSimulationDto } from './dto/chat-simulation.dtos';
import { ChatSimulationRepository } from './chat-simulation.repository.interface';
import { MailService } from '../mail/mail.service';
import { RedisProxy } from 'src/proxies/redis.proxy';
import { AgentProxy } from 'src/proxies/agent.proxy';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class ChatSimulationService {
  constructor(
    private readonly logger: LoggerService,
    private readonly chatSimulationRepository: ChatSimulationRepository,
    private readonly emailService: MailService,
    private readonly redisProxy: RedisProxy,
    private readonly agentProxy: AgentProxy,
    private readonly jwtService: JwtService,
  ) {}

  async createSimulation(
    createSimulationDto: CreateChatSimulationDto,
    user: UserDto,
  ) {
    try {
      this.logger.log('Creating simulation', createSimulationDto);
      const interviewCode = this.jwtService.sign({
        userId: user.id,
        email: user.email,
        companyId: user.companyId,
        role: user.role,
      });
      createSimulationDto.targetUserEmail = user.email;
      createSimulationDto.companyId = user.companyId;
      createSimulationDto.creatorId = user.id;
      createSimulationDto.interviewCode = interviewCode;
      const simulation =
        await this.chatSimulationRepository.createChatSimulation(
          createSimulationDto,
        );
      if (!simulation) {
        throw new HttpException('Simulation not created', HttpStatus.NOT_FOUND);
      }
      const simulationUrl = `http://dominio.com.br/chat-simulation?token=${simulation.interviewCode}`;
      const email = await this.emailService.sendMail({
        content: simulationUrl,
      });

      this.logger.log('Simulation created successfully');
      return {
        email,
        simulation,
        simulationUrl,
      };
    } catch (error) {
      this.logger.error('Error creating simulation', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error creating simulation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getSimulationsByCompany(companyId: number) {
    try {
      const simulations =
        await this.chatSimulationRepository.findChatSimulationsByCompany(
          companyId,
        );

      if (!simulations) {
        throw new HttpException('No simulations found', HttpStatus.NOT_FOUND);
      }

      return simulations;
    } catch (error) {
      this.logger.error('Error getting simulations', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error getting simulations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getSimulationById(id: string) {
    try {
      const simulation =
        await this.chatSimulationRepository.findChatSimulationById(id);
      return simulation;
    } catch (error) {
      this.logger.error('Error getting simulation by id', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error getting simulation by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async startSimulation(interviewCode: string) {
    try {
      const simulation =
        await this.chatSimulationRepository.findChatSimulationByInterviewCode(
          interviewCode,
        );
      const interviewToken = this.jwtService.sign(
        { interviewCode },
        { secret: process.env.JWT_SECRET },
      );
      const updatedSimulation =
        await this.chatSimulationRepository.updateChatSimulationStatus({
          interviewCode: simulation.interviewCode,
          interviewToken,
        });
      if (!updatedSimulation) {
        this.logger.error('Simulation not updated', simulation.interviewCode);
        throw new HttpException(
          'Simulation not updated',
          HttpStatus.BAD_REQUEST,
        );
      }
      return updatedSimulation;
    } catch (error) {
      this.logger.error('Error starting simulation', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error starting simulation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendMessage(dto: MessageDto) {
    try {
      const saveUserMessage = await this.redisProxy.saveMessage(
        {
          content: dto.message,
          user: 'person',
          date: new Date().toISOString(),
        },
        dto.chatId,
      );
      const agentResponse = await this.agentProxy.sendMessage(dto.message);
      const saveAgentMessage = await this.redisProxy.saveMessage(
        {
          content: agentResponse.message,
          user: 'agent',
          date: new Date().toISOString(),
        },
        dto.chatId,
      );
      return {
        userMessage: saveUserMessage,
        agentMessage: saveAgentMessage,
      };
    } catch (error) {
      this.logger.error('Error sending message', error);
      throw new HttpException(
        'Error sending message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getMessages(id: string) {
    try {
      const messages = await this.redisProxy.getAllMessages(id);
      return messages;
    } catch (error) {
      this.logger.error('Error getting messages', error);
      throw new HttpException(
        'Error getting messages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateSimulation(dto: UpdateSimulationDto, user: UserDto) {
    try {
      const simulation = await this.chatSimulationRepository.updateSimulation(dto, user.companyId);
      return simulation;
    } catch (error) {
      this.logger.error('Error updating simulation', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error updating simulation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
