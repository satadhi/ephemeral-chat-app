import { Module } from '@nestjs/common';
import { ChatEventsHandler } from './chat-events/chat-events.services';
import { BullModule } from '@nestjs/bullmq';
import { ConsumerModule } from 'src/consumer/consumer.module';


@Module({


  imports: [ConsumerModule],
  providers: [ChatEventsHandler],
  exports: [ChatEventsHandler],
})
export class EventsModule { }
