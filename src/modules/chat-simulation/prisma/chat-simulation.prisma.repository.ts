import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ChatSimulationRepository } from '../chat-simulation.repository.interface';
import { CreateChatSimulationDto } from '../dto/chat-simulation.dtos';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LoggerService } from 'src/modules/logger/logger.service';
@Injectable()
export class ChatSimulationPrismaRepository
  implements ChatSimulationRepository
{
  constructor(
    private prisma: PrismaService,
    private logger: LoggerService,
  ) {}

  async createChatSimulation(chatSimulation: CreateChatSimulationDto) {
    try {
      const simulation = await this.prisma.chatInterviewSimulation.create({
        data: {
          title: chatSimulation.title,
          description: chatSimulation.description,
          targetUserEmail: chatSimulation.targetUserEmail,
          interviewCode: chatSimulation.interviewCode,
          company: {
            connect: {
              id: chatSimulation.companyId
            }
          },
          creator: {
            connect: {
              id: chatSimulation.creatorId
            }
          }
        },
      });
      return simulation;
    } catch (error) {
      this.logger.error('Error creating chat simulation', error);
      throw new HttpException(
        'Error creating chat simulation',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findChatSimulationsByCompany(companyId: number) {
    try {
      this.logger.log('Finding chat simulations by company', companyId);
      return this.prisma.company.findUnique({
        where: {
          id: companyId,
        },
        select: {
          ChatInterviewSimulation: true,
        },
      });
    } catch (error) {
      this.logger.error('Error finding chat simulations by company', error);
      throw new HttpException(
        'Error finding chat simulations by company',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findChatSimulationById(id: string) {
    try {
      return this.prisma.chatInterviewSimulation.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      this.logger.error('Error finding chat simulation by id', error);
      throw new HttpException(
        'Error finding chat simulation by id',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findChatSimulationByInterviewCode(interviewCode: string) {
    try {
      const simulation = await this.prisma.chatInterviewSimulation.findUnique({
        where: {
          interviewCode,
        },
      });
      if (!simulation) {
        this.logger.error('Simulation not found', interviewCode);
        throw new HttpException('Simulation not found', HttpStatus.NOT_FOUND);
      }
      if (simulation.status !== 'PENDING') {
        this.logger.error('Simulation not pending', interviewCode);
        throw new HttpException(
          'Simulation not pending',
          HttpStatus.BAD_REQUEST,
        );
      }
      return simulation;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error finding chat simulation by interview code',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateChatSimulationStatus(data: {interviewCode: string, interviewToken: string}) {
    try {
      const simulation = await this.prisma.chatInterviewSimulation.update({
        where: { interviewCode: data.interviewCode },
        data: { status: 'IN_PROGRESS', interviewToken: data.interviewToken },
      });
      return simulation;
    } catch (error) {
      this.logger.error('Error updating chat simulation status', error);
      throw new HttpException(
        'Error updating chat simulation status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
