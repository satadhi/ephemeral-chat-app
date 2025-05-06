import { Module } from '@nestjs/common';
import { KafkaSetupService } from './kafka-setup.service';

@Module({
  providers: [KafkaSetupService],
  exports: [KafkaSetupService],
})
export class KafkaSetupModule {}
