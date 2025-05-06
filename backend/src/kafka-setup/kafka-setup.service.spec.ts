import { Test, TestingModule } from '@nestjs/testing';
import { KafkaSetupService } from './kafka-setup.service';

describe('KafkaSetupService', () => {
  let service: KafkaSetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KafkaSetupService],
    }).compile();

    service = module.get<KafkaSetupService>(KafkaSetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
