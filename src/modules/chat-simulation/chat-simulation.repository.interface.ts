import { ChatInterviewSimulation } from '@prisma/client';
import { CreateChatSimulationDto } from './dto/create-chat-simulation.dto';
import { UpdateChatSimulationDto } from './dto/update-chat-simulation.dto';

export abstract class ChatSimulationRepository {
  abstract createChatSimulation(
    chatSimulation: CreateChatSimulationDto,
  ): Promise<ChatInterviewSimulation>;  

  abstract findChatSimulationsByCompany(companyId: number): Promise<any>;
  abstract findChatSimulationById(id: number): Promise<ChatInterviewSimulation>;
  abstract findChatSimulationByInterviewCode(interviewCode: string): Promise<ChatInterviewSimulation>;
  abstract updateChatSimulationStatus(interviewCode: string): Promise<ChatInterviewSimulation>;
  abstract getChatSimulation(id: number): Promise<ChatInterviewSimulation>;
}
