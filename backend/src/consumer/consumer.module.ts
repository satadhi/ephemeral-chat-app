import { Module } from '@nestjs/common';
import { ConsumerService } from './kafka.aconsumer.service';
import { KafkaSetupModule } from 'src/kafka-setup/kafka-setup.module';

@Module({
  providers: [ConsumerService],
  imports: [KafkaSetupModule],
})
export class ConsumerModule { }
