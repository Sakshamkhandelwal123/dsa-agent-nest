import { Test, TestingModule } from '@nestjs/testing';
import { AgentController } from './agent.controller';
import { AgentService } from './agent.service';
import { SuggestionService } from '../suggestion/suggestion.service';
import { ChatService } from '../chat/chat.service';

describe('AgentController', () => {
  let controller: AgentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentController],
      providers: [
        {
          provide: AgentService,
          useValue: { askAgent: jest.fn() }
        },
        {
          provide: SuggestionService,
          useValue: { suggestFromInsights: jest.fn() }
        },
        {
          provide: ChatService,
          useValue: { getLearningInsights: jest.fn() }
        }
      ],
    }).compile();

    controller = module.get<AgentController>(AgentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
