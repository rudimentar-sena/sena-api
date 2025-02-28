import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ChatSimulationService } from './chat-simulation.service';
import { CreateChatSimulationDto } from './dto/create-chat-simulation.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { InterviewGuard } from 'src/guards/interview.guard';

@Controller('v1/chat-simulation')
export class ChatSimulationController {
  constructor(private readonly chatSimulationService: ChatSimulationService) {}

  @UseGuards(AuthGuard)
  @Post()
  async createSimulation(
    @Body() createSimulationDto: CreateChatSimulationDto,
    @Request() req,
  ) {
    const user = req.user;
    return this.chatSimulationService.createSimulation(
      createSimulationDto,
      user,
    );
  }
  @UseGuards(AuthGuard)
  @Get()
  async getSimulation(@Request() req) {
    const companyId = req.user.companyId;
    return this.chatSimulationService.getSimulationsByCompany(companyId);
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  async getSimulationById(@Param('id') id: number) {
    return this.chatSimulationService.getSimulationById(id);
  }

  @Post('/start')
  async startSimulation(@Body() interviewCode: string) {
    return this.chatSimulationService.startSimulation(interviewCode);
  }
  @UseGuards(InterviewGuard)
  @Get('chat/:id')
  async getChatSimulation(@Param('id', ParseIntPipe) id: number) {  
    return this.chatSimulationService.getChatSimulation(id);
  }
}
