import { Module } from '@nestjs/common';
import { KafkaProducerService } from './producer.service';
import { KafkaSetupModule } from 'src/kafka-setup/kafka-setup.module';
@Module({
  providers: [KafkaProducerService],
  imports:[KafkaSetupModule]
})
export class ProducerModule {}
