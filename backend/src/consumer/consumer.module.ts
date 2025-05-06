import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { KafkaSetupModule } from 'src/kafka-setup/kafka-setup.module';

@Module({
  providers: [ConsumerService],
  imports: [KafkaSetupModule],
})
export class ConsumerModule {}
