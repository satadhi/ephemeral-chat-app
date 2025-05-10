import { Module } from '@nestjs/common';
import { ChatEventsHandler } from './chat-events/chat-events.services';
import { BullModule } from '@nestjs/bullmq';


@Module({
  providers: [ChatEventsHandler],
  exports: [ChatEventsHandler],
})
export class EventsModule { }
