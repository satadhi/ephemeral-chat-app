import { Module } from '@nestjs/common';
import { ConsumerService } from './kafka.consumer.service';
import { KafkaSetupModule } from 'src/kafka-setup/kafka-setup.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  providers: [ConsumerService],
  imports: [KafkaSetupModule, EventsModule],
})
export class ConsumerModule { }
