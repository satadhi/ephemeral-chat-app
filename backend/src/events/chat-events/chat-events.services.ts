import { Module, Logger, Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { IMessagePayload, ISocketEventType } from 'src/common-interfaces/common.interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ChatEventsHandler {
  private readonly logger = new Logger(ChatEventsHandler.name);
  private users: Map<string, Socket> = new Map(); // clientId -> Socket
  private rooms: Map<string, Set<string>> = new Map(); // roomId -> Set of clientIds

  constructor(private eventEmitter: EventEmitter2) { }
  @OnEvent('socket.connected')
  handleSocketConnected(payload: { client: Socket; data: any }) {

    const userId = this.extractUserId(payload.client);
    this.logger.log(`User socket connected: ${userId}`);

    this.users.set(userId, payload.client);
  }

  @OnEvent('socket.disconnected')
  handleSocketDisconnected(payload: { client: Socket; data: any }) {
    this.logger.log(`Client disconnected: ${payload.client.id}`);
    const userId = this.extractUserId(payload.client);
    this.users.delete(userId);
    for (const room of this.rooms.values()) {
      room.delete(userId);
    }
  }

  @OnEvent('socket.join_room')
  handleJoinRoom(payload: { client: Socket; data: { roomId: string } }) {
    const { roomId } = payload.data;
    const userId = this.extractUserId(payload.client);
    const socket = this.users.get(userId);

    if (!socket) return;

    socket.join(roomId); // join creates a socket.io room which is different from the chat room

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());

      const createRoom: IMessagePayload = {
        roomId,
        createdBy: userId,
        messageValue: '',
        event: ISocketEventType.room_added,
        createdAt: new Date(),
      };
      // send message that room is created
      this.eventEmitter.emit('kafka.produce', createRoom);

    }

    this.rooms.get(roomId)!.add(userId);

    const joinMessage: IMessagePayload = {
      roomId,
      createdBy: userId,
      messageValue: `${userId} joined the room`,
      event: ISocketEventType.user_joined,
      createdAt: new Date(),
    };

    // send message that room is created
    this.eventEmitter.emit('kafka.produce', joinMessage);
  }

  @OnEvent('socket.leave_room')
  leaveRoom(payload: { client: Socket; data: { roomId: string } }) {
    const { roomId } = payload.data;
    const userId = this.extractUserId(payload.client);
    const socket = this.users.get(userId);
    if (!socket) return;

    socket.leave(roomId);
    this.rooms.get(roomId)?.delete(userId);
  }

  @OnEvent('socket.send_message')
  sendMessageToRoom(payload: {
    client: Socket;
    data: IMessagePayload;
  }) {
    this.eventEmitter.emit('kafka.produce', payload.data);
  }

  private extractUserId(client: Socket): string {
    console.log('Extracting userId from client:', client.handshake.query.userId);
    return client.handshake.query.userId as string; // You can replace this with JWT auth
  }
}
