import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IMessagePayload } from 'src/common-interfaces/common.interfaces';
import { QUEUE_COMMAND_EVENTS, IQueueEventType } from 'src/common-interfaces/common.interfaces';
@Injectable()
export class QueueProducerService {
    constructor(
        @InjectQueue(QUEUE_COMMAND_EVENTS) private chatQueue: Queue
    ) { }

    async setRoomTimer(message: IMessagePayload) {

        const payload = {
            roomId: message.roomId,
            event: IQueueEventType.room_timer,
            createdAt: message.createdAt
        }
        this.chatQueue.add('set-room-timer', payload, {
            delay: 1000 * 60 * 2, // or use delay in ms
            removeOnComplete: true,
            removeOnFail: true,
            jobId: message.roomId,
        });
    }
}
