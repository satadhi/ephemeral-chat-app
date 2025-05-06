import { Test, TestingModule } from '@nestjs/testing';
import { ConsistentHashingService } from './consistent-hashing.service';

describe('ConsistentHashingService', () => {
  let service: ConsistentHashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsistentHashingService],
    }).compile();

    service = module.get<ConsistentHashingService>(ConsistentHashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
