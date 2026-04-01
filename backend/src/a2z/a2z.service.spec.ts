import { Test, TestingModule } from '@nestjs/testing';
import { A2zService } from './a2z.service';

describe('A2zService', () => {
  let service: A2zService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [A2zService],
    }).compile();

    service = module.get<A2zService>(A2zService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
