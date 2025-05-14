// types/index.ts
export type Message = {
    sender: string;
    content: string;
    timestamp: number;
};


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