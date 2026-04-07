import { Test, TestingModule } from '@nestjs/testing';
import { AgentService } from './agent.service';
import { ConfigService } from '@nestjs/config';
import { ChatService } from '../chat/chat.service';

describe('AgentService', () => {
  let service: AgentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AgentService,
        {
          provide: ConfigService,
          useValue: { get: jest.fn(() => 'test-key') }
        },
        {
          provide: ChatService,
          useValue: {
            getHistory: jest.fn().mockResolvedValue([]),
            saveChat: jest.fn().mockResolvedValue({})
          }
        }
      ],
    }).compile();

    service = module.get<AgentService>(AgentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
