import { OnEvent } from '@nestjs/event-emitter';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaSetupService } from '../kafka-setup/kafka-setup.service';
import { CompressionTypes, Producer } from 'kafkajs';
import { IKafkaMessagePayload } from 'src/common-interfaces/common.interfaces';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(private readonly kafkaService: KafkaSetupService) {}
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

    const res = await this.producer.send({
      topic: this.sendMessageTopic,
        acks: 0, // 0 means no acknowledgment
        messages: [{ key, value}],
    });

  }
}
