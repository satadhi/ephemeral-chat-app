import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Kafka, Admin, Producer, Consumer } from 'kafkajs';
@Injectable()
export class KafkaSetupService implements OnModuleInit {
  private kafka: Kafka;
  private admin: Admin;
  private logger = new Logger(KafkaSetupService.name);
  private readonly KAFKA_RETENTION_PERIOD:number = 1000 * 60 * 2; // 2 minutes
  private readonly KAFKA_CHAT_MESSAGE_TOPIC:string = 'chat-messages';  

  constructor(private readonly configService: ConfigService) {
    const brokers = this.configService
      .getOrThrow<string>('KAFKA_BROKERS')
      .split(',');
    const clientId = this.configService.getOrThrow<string>('KAFKA_CLIENT_ID');
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: brokers,
    });
    this.admin = this.kafka.admin();
  }

  async onModuleInit() {
    await this.admin.connect();

    const topics = [
      { topic: this.KAFKA_CHAT_MESSAGE_TOPIC, numPartitions: 10 },
      { topic: 'chat-rooms', numPartitions: 1 },
    ];

    const existingTopics = await this.admin.listTopics();
    const newTopics = topics.filter((t) => !existingTopics.includes(t.topic));

    if (newTopics.length > 0) {
      await this.admin.createTopics({
        topics: newTopics,
        waitForLeaders: true,
      });

      this.logger.log(
        'Created topics:',
        newTopics.map((t) => t.topic),
      );
    } else {
      this.logger.log('Topics already exist.');
    }

    await this.setRetentionPolicy();
    await this.admin.disconnect();
  }


  async setRetentionPolicy() {
    
    await this.admin.alterConfigs({
      resources: [
        {
          type: 2,
          name: 'chat-messages',
          configEntries: [
            {
              name: 'retention.ms',
              value: this.KAFKA_RETENTION_PERIOD.toString(),
            }
          ]
        },
      ],
      validateOnly: false
    });
    this.logger.log('Retention policy updated successfully');
  }

  getProducer(): Producer {
    return this.kafka.producer();
  }

  getConsumer(groupId: string): Consumer {
    return this.kafka.consumer({ groupId });
  }
}
