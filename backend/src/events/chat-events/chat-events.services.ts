import { Module, Logger, Injectable } from '@nestjs/common';

import { OnEvent } from '@nestjs/event-emitter';
import { Socket } from 'socket.io';
import { IMessagePayload, ISocketEventType } from 'src/common-interfaces/common.interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConsumerService } from 'src/consumer/kafka.consumer.service';

@Injectable()
export class ChatEventsHandler {
  private readonly logger = new Logger(ChatEventsHandler.name);
  private users: Map<string, Socket> = new Map(); // clientId -> Socket
  private rooms: Map<string, Set<string>> = new Map(); // roomId -> Set of clientIds
  constructor(private readonly eventEmitter: EventEmitter2,
    private readonly consumerService: ConsumerService,
  ) { }
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
  @OnEvent('socket.room_list')
  handleRoomList(payload: { client: Socket; data: any }) {
    const userId = this.extractUserId(payload.client);
    const socket = this.users.get(userId);
    if (!socket) return;

    const rooms = Array.from(this.rooms.keys());
    socket.emit(ISocketEventType.get_rooms_list, rooms);
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
      this.rooms.get(roomId)!.add(userId);

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

    payload.data.event = ISocketEventType.send_message;
    this.eventEmitter.emit('kafka.produce', payload.data);
  }

  @OnEvent('kafka.send_message')
  sendMessageToUsers(payload: { roomId: string, message: IMessagePayload }) {
    const room = this.rooms.get(payload.roomId);
    if (!room) return;

    switch (payload.message.event) {
      case ISocketEventType.room_added:
        for (const [userId, socket] of this.users) {
          console.log('Broadcasting room added message to user:', userId);
          socket.emit(ISocketEventType.get_messages, payload.message);
        }
        break;
      case ISocketEventType.room_deleted:
        this.rooms.delete(payload.roomId);
      default:
        // TODO: use soket.io rooms instead of this
        for (const userId of room) {
          const socket = this.users.get(userId);
          if (socket) {
            this.logger.log(`Sending message to user:', ${userId}, 'message type:', ${payload.message.event}`);
            socket.emit(ISocketEventType.get_messages, payload.message);
          }
        }
    }
  }

  @OnEvent('socket.seek_room_history')
  handleSeekRoomHistory(payload: { client: Socket; data: IMessagePayload }) {
    const { roomId } = payload.data;
    const userId = this.extractUserId(payload.client);
    this.eventEmitter.emit('kafka.consume.seek_room_history', { userId, roomId });
  }



  @OnEvent('kafka.room_history.user')
  sendRoomHistoryToUser(payload: { userId: string, roomId: string, messages: IMessagePayload[] }) {
    const socket = this.users.get(payload.userId);
    if (!socket) {
      this.logger.log(`User ${payload.userId} not connected`);
      return;
    }

    socket.emit(ISocketEventType.get_room_history, payload.messages);
  }

  private extractUserId(client: Socket): string {
    console.log('Extracting userId from client:', client.handshake.query.userId);
    return client.handshake.query.userId as string; // You can replace this with JWT auth
  }
}
