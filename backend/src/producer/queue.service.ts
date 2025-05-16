import { Injectable } from '@nestjs/common';
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { IMessagePayload, ISocketEventType } from 'src/common-interfaces/common.interfaces';
import { QUEUE_COMMAND_EVENTS, IQueueEventType } from 'src/common-interfaces/common.interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
@Processor(QUEUE_COMMAND_EVENTS)
export class QueueProducerService extends WorkerHost {
    constructor(
        @InjectQueue(QUEUE_COMMAND_EVENTS) private chatQueue: Queue,
        private eventEmitter: EventEmitter2,
    ) {
        super();
    }

    async setRoomTimer(message: IMessagePayload) {

        console.log('Setting room timer for message:', message);
        message.event = ISocketEventType.room_deleted;
        this.chatQueue.add('set-room-timer', message, {
            // delay: 1000 * 60 * 2, // or use delay in ms

            delay: 1000 * 60 * 2, // HACK:10 minutes
            removeOnComplete: true,
            removeOnFail: true,
            jobId: message.roomId,
        });
    }

    async process(job: Job<IMessagePayload>) {
        this.eventEmitter.emit('kafka.produce', job.data);
    }
}
