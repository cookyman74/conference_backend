import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RedisService } from '../redis/redis.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private authService: AuthService,
    private redisService: RedisService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const user = await this.authService.validateToken(token);
      if (!user) {
        client.disconnect();
      } else {
        client.data.user = user;
      }
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    // 필요한 경우 정리 작업 수행
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() data: {roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await client.join(data.roomId.toString());
      return { event: 'joinRoom', data: { roomId: data.roomId }};
    } catch (error) {
      throw new WsException('Failed to join room');
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await client.leave(data.roomId.toString());
      return { event: 'leftRoom', data: { roomId: data.roomId } };
    } catch (error) {
      throw new WsException('Failed to leave room');
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { roomId: number; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const user = client.data.user;
      const messageData = { ...data, userId: user.id, username: user.username };
      await this.redisService.set(`chat:${data.roomId}:${Date.now()}`, JSON.stringify(messageData));
      this.server.to(data.roomId.toString()).emit('message', messageData);
      return { event: 'messageSent', data: messageData };
    } catch (error) {
      throw new WsException('Failed to send message');
    }
  }

}