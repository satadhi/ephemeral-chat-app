import { Module } from '@nestjs/common';
import { ChatEventsHandler } from './chat-events/chat-events.services';

@Module({
  providers: [ChatEventsHandler],
  exports: [ChatEventsHandler],
})
export class EventsModule {}
