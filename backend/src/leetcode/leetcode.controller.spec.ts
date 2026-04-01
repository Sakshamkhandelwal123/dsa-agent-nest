import { Test, TestingModule } from '@nestjs/testing';
import { LeetcodeController } from './leetcode.controller';
import { LeetcodeService } from './leetcode.service';

describe('LeetcodeController', () => {
  let controller: LeetcodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeetcodeController],
      providers: [
        {
          provide: LeetcodeService,
          useValue: { getUserStats: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<LeetcodeController>(LeetcodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
