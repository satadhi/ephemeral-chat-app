export interface IKafkaMessagePayload {
    messageValue: string;
    createdBy: string;
    roomId: string;
    event?: string;
    createdAt?: Date;
    messageId?: string;
}