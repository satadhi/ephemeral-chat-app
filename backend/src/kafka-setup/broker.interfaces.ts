export enum RoomEventType {
  CREATED = 'created',
  UPDATED = 'updated',
  DELETED = 'deleted',
}

export interface IRoomEventPayload {
  event: RoomEventType;
  roomId: string;
  roomName: string;
  createdBy: string;
  timestamp: string;
}
