import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway(3001, {
  cors: {
    origin: '*', // Allow all origins or specify
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private eventEmitter: EventEmitter2) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.handshake.query.userId}`);
    this.eventEmitter.emit('socket.connected', {client});
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.eventEmitter.emit('socket.disconnected', {client});
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.eventEmitter.emit('socket.join_room', { client, data });
  }

  @SubscribeMessage('send_message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.eventEmitter.emit('socket.send_message', { client, data });
  }

  @SubscribeMessage('create_room')
  handleCreateRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('create_room', data);
    this.eventEmitter.emit('socket.join_room', { client, data });
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.eventEmitter.emit('socket.leave_room', { client, data });
  }

  @SubscribeMessage('seek_room_history')
  handleSeekHistory(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket,
  ) {
    this.eventEmitter.emit('socket.seek_room_history', { client, data });
  }
}
