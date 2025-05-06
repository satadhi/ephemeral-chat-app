import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaSetupService } from './kafka-setup/kafka-setup.service';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat-gateway/chat.gateway';
import { EventsModule } from './events/events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProducerModule } from './producer/producer.module';
import { ConsumerModule } from './consumer/consumer.module';
import { KafkaSetupModule } from './kafka-setup/kafka-setup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventsModule,
    EventEmitterModule.forRoot(),
    ProducerModule,
    ConsumerModule,
    KafkaSetupModule
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
