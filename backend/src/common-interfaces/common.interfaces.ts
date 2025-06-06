export interface IMessagePayload {
    messageValue: string;
    createdBy: string;
    roomId: string;
    event?: string;
    createdAt?: Date;
    messageId?: string;
    uuid?: string;
    offset?: number;
}

export enum ISocketEventType {
    user_joined = 'user_joined',
    leave_room = 'leave_room',
    join_room = 'join_room',
    room_added = 'room_added',
    room_deleted = 'room_deleted',
    send_message = 'send_message',
    get_messages = 'get_messages',
    get_room_history = 'get_room_history',
    get_rooms_list = 'get_rooms_list',
}

export enum IQueueEventType {
    room_timer = 'room_timer',
}

export const KAFKA_CHAT_MESSAGE_TOPIC: string = 'chat-messages';
export const KAFKA_ROOMS_TOPIC: string = 'chat-rooms';
export const QUEUE_COMMAND_EVENTS: string = 'queue-command-events';
export const TOTAL_PARTITIONS: number = 10;