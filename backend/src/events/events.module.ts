import { Module } from '@nestjs/common';
import { ChatEventsHandler } from './chat-events/chat-events.services';
import { BullModule } from '@nestjs/bullmq';


@Module({

  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    BullModule.registerQueue({
      name: 'chat-events',
      connection: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
  ],
  providers: [ChatEventsHandler],
  exports: [ChatEventsHandler],
})
export class EventsModule {}
