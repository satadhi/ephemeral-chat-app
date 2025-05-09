import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaSetupService } from '../kafka-setup/kafka-setup.service';
import { CompressionTypes, Producer } from 'kafkajs';
import { IKafkaMessagePayload } from 'src/common-interfaces/common.interfaces';
import { ISocketEventType } from '../common-interfaces/common.interfaces';
import { KAFKA_CHAT_MESSAGE_TOPIC, KAFKA_ROOMS_TOPIC } from '../common-interfaces/common.interfaces'


@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(private readonly kafkaService: KafkaSetupService) { }
  private sendMessageTopic: string = 'chat-messages';
  private producer: Producer;
  private readonly logger = new Logger(KafkaProducerService.name);

  async onModuleInit() {
    this.producer = this.kafkaService.getProducer();
    await this.producer.connect();

  }

  @OnEvent('kafka.produce')
  async handleKafkaProduce(payload: IKafkaMessagePayload) {

    const key = payload.roomId;
    const value = Buffer.from(JSON.stringify(payload));


    switch (payload.event) {

      case ISocketEventType.join_room:
        await this.producer.send({
          topic: KAFKA_CHAT_MESSAGE_TOPIC,
          acks: 0,
          messages: [{ key, value }],
        });

        // set room deleted event timer  
        break;

      case ISocketEventType.user_joined:
        await this.producer.send({
          topic: KAFKA_ROOMS_TOPIC,
          acks: 0, // 0 means no acknowledgment
          messages: [{ key, value }],
        });
        break;
      default:
        this.logger.error(`bad event ${payload}`);

    }



  }
}
