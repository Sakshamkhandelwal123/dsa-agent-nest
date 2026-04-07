import { Test, TestingModule } from '@nestjs/testing';
import { A2zController } from './a2z.controller';
import { A2zService } from './a2z.service';

describe('A2zController', () => {
  let controller: A2zController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [A2zController],
      providers: [
        {
          provide: A2zService,
          useValue: {
            getAll: jest.fn(),
            getRandom: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<A2zController>(A2zController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
