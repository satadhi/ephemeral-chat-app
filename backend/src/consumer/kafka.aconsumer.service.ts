// consumer.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaSetupService } from '../kafka-setup/kafka-setup.service';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { KAFKA_CHAT_MESSAGE_TOPIC, KAFKA_ROOMS_TOPIC } from '../common-interfaces/common.interfaces';
@Injectable()
export class ConsumerService implements OnModuleDestroy, OnModuleInit {
  private messageEventconsumer: Consumer;
  private roomEventconsumer: Consumer;

  constructor(private readonly kafkaSetupService: KafkaSetupService) { }

  async onModuleInit() {
    const messageEventGroupId = 'user-chat-events';
    const roomEventGroupId = 'user-room-events';
    await this.consumeChatMessageEvents(KAFKA_CHAT_MESSAGE_TOPIC, messageEventGroupId);
    await this.consumeRoomEvents(KAFKA_ROOMS_TOPIC, roomEventGroupId);
  }


  async consumeChatMessageEvents(topic: string, consumerGroupId: string) {
    this.messageEventconsumer = this.kafkaSetupService.getConsumer(consumerGroupId);

    await this.messageEventconsumer.connect();
    console.log(`✅ Consumer messageEventconsumer connected to group "${consumerGroupId}"`);

    await this.messageEventconsumer.subscribe({ topic, fromBeginning: true });

    await this.messageEventconsumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        console.log(`****************************Consumer message Event****************************`);
        console.log({
          topic,
          partition,
          key: message.key?.toString(),
          value: message.value?.toString(),
          offset: message.offset,
        });
        console.log(`****************************Consumer message Event****************************`);
        // You can add business logic here
      },
    });
  }


  async consumeRoomEvents(topic: string, consumerGroupId: string) {
    this.roomEventconsumer = this.kafkaSetupService.getConsumer(consumerGroupId);

    await this.roomEventconsumer.connect();
    console.log(`✅ Consumer roomEventconsumer connected to group "${consumerGroupId}"`);

    await this.roomEventconsumer.subscribe({ topic, fromBeginning: true });

    await this.roomEventconsumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;

        console.log(`****************************Consumer Room Event****************************`);
        console.log({
          topic,
          partition,
          key: message.key?.toString(),
          value: message.value?.toString(),
          offset: message.offset,
        });

        console.log(`****************************Consumer Room Event****************************`);

        // You can add business logic here
      },
    });
  }

  async onModuleDestroy() {
    if (this.messageEventconsumer) {
      await this.messageEventconsumer.disconnect();
      console.log('🛑 Consumer disconnected');
    }
  }
}
