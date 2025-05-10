import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BullModule } from '@nestjs/bullmq';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatGateway } from './chat-gateway/chat.gateway';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { KafkaSetupModule } from './kafka-setup/kafka-setup.module';
import { RedisQueueHealthCheckService } from './redis-health-check-service';
import { QUEUE_COMMAND_EVENTS } from './common-interfaces/common.interfaces';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: QUEUE_COMMAND_EVENTS,
      imports: [ConfigModule],
      useFactory: async () => ({}), // optional options per queue
      inject: [],
    }),
    EventsModule,
    EventEmitterModule.forRoot(),
    ProducerModule,
    ConsumerModule,
    KafkaSetupModule
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway, RedisQueueHealthCheckService],
})
export class AppModule { }
