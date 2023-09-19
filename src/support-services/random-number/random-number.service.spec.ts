import { Test, TestingModule } from '@nestjs/testing';
import { RandomNumberService } from './random-number.service';

describe('RandomNumberService', () => {
  let service: RandomNumberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RandomNumberService],
    }).compile();

    service = module.get<RandomNumberService>(RandomNumberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
