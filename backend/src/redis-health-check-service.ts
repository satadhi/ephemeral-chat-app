import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";
import { QUEUE_COMMAND_EVENTS } from "./common-interfaces/common.interfaces";
@Injectable()
export class RedisQueueHealthCheckService {
    logger = new Logger("RedisQueue");

    constructor(@InjectQueue(QUEUE_COMMAND_EVENTS) private someQueue: Queue) {
        this.init();
    }

    async init() {
        try {
            await this.delay(1000, 1);
            this.checkQueueAvailability();
        } catch (e) {
            this.logger.error(e);
        }
    }

    private async checkQueueAvailability(): Promise<void> {
        try {
            const client = await this.someQueue.client;
            if (client.status === "ready") {
                this.logger.log('✅ Redis is connected and ready!');
            } else {
                this.logger.error('❌ Redis connection error:');
            }
        } catch (error) {
            this.logger.error('❌ Error accessing Redis client:', error);
        }
    }

    delay(t: number, val: any) {
        return new Promise(function (resolve) {
            setTimeout(function () {
                resolve(val);
            }, t);
        });
    }
}