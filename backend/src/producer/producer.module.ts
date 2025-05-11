import { Module } from '@nestjs/common';
import { KafkaProducerService } from './kafka.producer.service';
import { KafkaSetupModule } from 'src/kafka-setup/kafka-setup.module';
import { QueueProducerService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule } from '@nestjs/config';
import { QUEUE_COMMAND_EVENTS } from 'src/common-interfaces/common.interfaces';
@Module({
  providers: [KafkaProducerService, QueueProducerService],
  imports: [KafkaSetupModule,

    BullModule.registerQueueAsync({
      name: QUEUE_COMMAND_EVENTS,
      imports: [ConfigModule],
      useFactory: async () => ({}), // optional options per queue
      inject: [],
    }),
  ]
})
export class ProducerModule { }
