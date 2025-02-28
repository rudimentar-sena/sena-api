import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { CreateChatSimulationDto } from './dto/create-chat-simulation.dto';
import { ChatSimulationRepository } from './chat-simulation.repository.interface';
import { MailService } from '../mail/mail.service';
@Injectable()
export class ChatSimulationService {
  constructor(
    private readonly logger: LoggerService,
    private readonly chatSimulationRepository: ChatSimulationRepository,
    private readonly emailService: MailService,
  ) {}

  async createSimulation(createSimulationDto: CreateChatSimulationDto, user: any) {
    try {
      this.logger.log('Creating simulation', createSimulationDto);
      createSimulationDto.targetUserEmail = user.email;
      createSimulationDto.companyId = user.companyId;
      createSimulationDto.creatorId = user.id;
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
  async getSimulationById(id: number) {
    try {
      const simulation = await this.chatSimulationRepository.findChatSimulationById(id);
      return simulation;
    } catch (error) {
      this.logger.error('Error getting simulation by id', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error getting simulation by id', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async startSimulation(interviewCode: string) {
    try {
      const simulation = await this.chatSimulationRepository.findChatSimulationByInterviewCode(interviewCode);
      if (simulation.status !== 'PENDING') {
        throw new HttpException('Simulation not pending', HttpStatus.BAD_REQUEST);
      }
     const updatedSimulation = await this.chatSimulationRepository.updateChatSimulationStatus(simulation.interviewCode);
     if (!updatedSimulation) {
      this.logger.error('Simulation not updated', simulation.interviewCode);
      throw new HttpException('Simulation not updated', HttpStatus.BAD_REQUEST);
     }
      return updatedSimulation;
    } catch (error) {
      this.logger.error('Error starting simulation', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error starting simulation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getChatSimulation(id: number) {
    try {
      const simulation = await this.chatSimulationRepository.getChatSimulation(id);
      return simulation;
    } catch (error) {
      this.logger.error('Error getting chat simulation', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Error getting chat simulation', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
