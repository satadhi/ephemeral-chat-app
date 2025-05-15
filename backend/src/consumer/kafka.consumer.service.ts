// consumer.service.ts
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { KafkaSetupService } from '../kafka-setup/kafka-setup.service';
import { Consumer, EachMessagePayload } from 'kafkajs';
import { IMessagePayload, KAFKA_CHAT_MESSAGE_TOPIC, KAFKA_ROOMS_TOPIC } from '../common-interfaces/common.interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OnEvent } from '@nestjs/event-emitter';
import { ConsistentHashingService } from '../../libs/consistent-hashing/src/consistent-hashing.service';


@Injectable()
export class ConsumerService implements OnModuleDestroy, OnModuleInit {
  private messageEventconsumer: Consumer;
  private roomEventconsumer: Consumer;
  private readonly historySeekerConsumerGroupId = 'chat-history-seeker';
  private readonly logger = new Logger(ConsumerService.name);

  constructor(private readonly kafkaSetupService: KafkaSetupService,
    private readonly eventEmitter: EventEmitter2,
    private readonly consistentHashingService: ConsistentHashingService,
  ) { }

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
        const eventPayload = JSON.parse(message.value?.toString() || '{}');
        const roomId = eventPayload.roomId;
        eventPayload.offset = message.offset;

        this.eventEmitter.emit('kafka.send_message', { roomId, message: eventPayload });

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
        const eventPayload = JSON.parse(message.value?.toString() || '{}');
        const roomId = eventPayload.roomId;
        eventPayload.offset = message.offset;

        this.eventEmitter.emit('kafka.send_message', { roomId, message: eventPayload });
      },
    });
  }

  @OnEvent('kafka.consume.seek_room_history')
  async handleSeekRoomHistory(payload: { userId: string, roomId: string; offset?: number }) {
    const topic = KAFKA_CHAT_MESSAGE_TOPIC;
    const partition = this.consistentHashingService.getPartitionIndex(payload.roomId, 10);
    const limit = 20;

    // Use a unique groupId for read-only consumption
    const groupId = this.historySeekerConsumerGroupId;
    const consumer = this.kafkaSetupService.getConsumer(groupId);
    const admin = this.kafkaSetupService.getAdmin;

    try {
      await admin.connect();
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });

      // Get the latest offset for the partition
      const offsets = await admin.fetchTopicOffsets(topic);
      const partitionOffset = offsets.find((p: any) => p.partition === partition);
      const latestOffset = parseInt(partitionOffset.high, 10);
      const startOffset = Math.max(latestOffset - limit, 0);

      const messages: any[] = [];

      await consumer.run({
        autoCommit: false,
        eachBatchAutoResolve: false,
        eachBatch: async ({ batch, resolveOffset, heartbeat, pause }) => {
          for (const message of batch.messages) {
            if (Number(message.offset) < startOffset) {
              continue;
            }
            messages.push({
              offset: message.offset,
              value: message.value?.toString(),
              timestamp: message.timestamp,
            });
            if (messages.length >= limit) {
              pause();
              break;
            }
            resolveOffset(message.offset);
            await heartbeat();
          }
        },
      });

      await new Promise(res => setTimeout(res, 200)); // FIXME: Major flow here need to be fixed
      this.eventEmitter.emit('kafka.room_history.user',
        {
          userId: payload.userId,
          roomId: payload.roomId,
          messages: this.historyDataTransformer(payload.roomId, messages)
        });
      return messages;
    } catch (err) {
      this.logger.error('Error fetching chat history:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    if (this.messageEventconsumer) {
      await this.messageEventconsumer.disconnect();
      console.log('🛑 Consumer disconnected');
    }
  }

  private historyDataTransformer(roomId: string, messages: any[]) {
    return messages.reduce<IMessagePayload[]>((acc, message) => {
      const parsed = JSON.parse(message.value.toString());

      if (parsed.roomId === roomId) {
        parsed.offset = message.offset;
        acc.push(parsed);
      }
      return acc;
    }, []);
  }
}
