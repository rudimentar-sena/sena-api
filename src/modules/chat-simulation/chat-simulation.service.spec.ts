import { Test, TestingModule } from '@nestjs/testing';
import { ChatSimulationService } from './chat-simulation.service';

describe('ChatSimulationService', () => {
  let service: ChatSimulationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatSimulationService],
    }).compile();

    service = module.get<ChatSimulationService>(ChatSimulationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
