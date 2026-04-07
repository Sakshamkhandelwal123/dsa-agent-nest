import { Test, TestingModule } from '@nestjs/testing';
import { A2zService } from './a2z.service';
import { getModelToken } from '@nestjs/mongoose';
import { A2Z } from './a2z.schema';

describe('A2zService', () => {
  let service: A2zService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        A2zService,
        {
          provide: getModelToken(A2Z.name),
          useValue: {}
        }
      ],
    }).compile();

    service = module.get<A2zService>(A2zService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
