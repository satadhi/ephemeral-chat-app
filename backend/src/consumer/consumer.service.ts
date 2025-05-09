// consumer.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaSetupService } from '../kafka-setup/kafka-setup.service';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { KAFKA_CHAT_MESSAGE_TOPIC, KAFKA_ROOMS_TOPIC } from '../common-interfaces/common.interfaces';
@Injectable()
export class ConsumerService implements OnModuleDestroy, OnModuleInit {
  private consumer: Consumer;

  constructor(private readonly kafkaSetupService: KafkaSetupService) {}

    async onModuleInit() {
        const topic = 'chat-messages'; 
        const groupId = 'user-chat-events';
        await this.consume(topic, groupId);
    }
   

  async consume(topic: string, groupId: string) {
    this.consumer = this.kafkaSetupService.getConsumer(groupId);

    await this.consumer.connect();
    console.log(`✅ Consumer connected to group "${groupId}"`);

    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, partition, message } = payload;
        console.log({
          topic,
          partition,
          key: message.key?.toString(),
          value: message.value?.toString(),
          offset: message.offset,
        });

        // You can add business logic here
      },
    });
  }

  async onModuleDestroy() {
    if (this.consumer) {
      await this.consumer.disconnect();
      console.log('🛑 Consumer disconnected');
    }
  }
}
