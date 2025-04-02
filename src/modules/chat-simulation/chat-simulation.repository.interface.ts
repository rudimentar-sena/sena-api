import { ChatInterviewSimulation } from '@prisma/client';
import { CreateChatSimulationDto, UpdateSimulationDto } from './dto/chat-simulation.dtos';

export abstract class ChatSimulationRepository {
  abstract createChatSimulation(
    chatSimulation: CreateChatSimulationDto,
  ): Promise<ChatInterviewSimulation>;  

  abstract findChatSimulationsByCompany(companyId: number): Promise<any>;
  abstract findChatSimulationById(id: string): Promise<ChatInterviewSimulation>;
  abstract findChatSimulationByInterviewCode(interviewCode: string): Promise<ChatInterviewSimulation>;
  abstract updateChatSimulationStatus(data: {interviewCode: string, interviewToken: string}): Promise<ChatInterviewSimulation>;
  abstract updateSimulation(dto: UpdateSimulationDto, companyId: number): Promise<ChatInterviewSimulation>;
}
