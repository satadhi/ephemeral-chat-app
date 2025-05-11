import { Module } from '@nestjs/common';
import { ConsumerService } from './kafka.consumer.service';
import { KafkaSetupModule } from 'src/kafka-setup/kafka-setup.module';
import { EventsModule } from 'src/events/events.module';
import { ConsistentHashingModule } from '@app/consistent-hashing/consistent-hashing.module';

@Module({
  providers: [ConsumerService],
  imports: [KafkaSetupModule, EventsModule, ConsistentHashingModule],
  exports: [ConsumerService],
})
export class ConsumerModule { }
