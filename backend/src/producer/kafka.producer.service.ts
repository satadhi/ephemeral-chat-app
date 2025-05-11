import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaSetupService } from '../kafka-setup/kafka-setup.service';
import { Producer } from 'kafkajs';
import { IMessagePayload } from 'src/common-interfaces/common.interfaces';
import { ISocketEventType } from '../common-interfaces/common.interfaces';
import { KAFKA_CHAT_MESSAGE_TOPIC, KAFKA_ROOMS_TOPIC } from '../common-interfaces/common.interfaces'
import { v4 as uuid } from 'uuid';
import { QueueProducerService } from './queue.service';
import { ConsistentHashingService } from '../../libs/consistent-hashing/src/consistent-hashing.service';
import { TOTAL_PARTITIONS } from '../common-interfaces/common.interfaces';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaSetupService,
    private readonly queueProducerService: QueueProducerService,
    private readonly consistentHashingService: ConsistentHashingService,
  ) { }
  private producer: Producer;
  private readonly logger = new Logger(KafkaProducerService.name);

  async onModuleInit() {
    this.producer = this.kafkaService.getProducer();
    await this.producer.connect();

  }

  @OnEvent('kafka.produce')
  async handleKafkaProduce(payload: IMessagePayload) {

    const key = payload.roomId;
    payload.uuid = uuid();
    const value = Buffer.from(JSON.stringify(payload));
    const partition = this.consistentHashingService.getPartitionIndex(key, TOTAL_PARTITIONS);

    switch (payload.event) {

      case ISocketEventType.room_added:
        await this.producer.send({
          topic: KAFKA_ROOMS_TOPIC,
          acks: 0,
          messages: [{ key, value }],
        });

        // set room deleted event timer  
        this.queueProducerService.setRoomTimer(payload)
        break;

      case ISocketEventType.user_joined:
        await this.producer.send({
          topic: KAFKA_CHAT_MESSAGE_TOPIC,
          acks: 0,
          messages: [{ value, partition }],
        });
        break;

      case ISocketEventType.room_deleted:
        await this.producer.send({
          topic: KAFKA_ROOMS_TOPIC,
          acks: 0,
          messages: [{ value, partition }],
        });

      case ISocketEventType.send_message:
        await this.producer.send({
          topic: KAFKA_CHAT_MESSAGE_TOPIC,
          acks: 0,
          messages: [{ value, partition }],
        });
        break;
      default:
        this.logger.error(`bad event ${payload}`);

    }
  }
}
