import { Test, TestingModule } from '@nestjs/testing';
import { ChatSimulationController } from './chat-simulation.controller';
import { ChatSimulationService } from './chat-simulation.service';

describe('ChatSimulationController', () => {
  let controller: ChatSimulationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatSimulationController],
      providers: [ChatSimulationService],
    }).compile();

    controller = module.get<ChatSimulationController>(ChatSimulationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
