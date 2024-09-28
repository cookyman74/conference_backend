import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Connection, OpenVidu, Session } from 'openvidu-node-client';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

@Injectable()
export class OpenviduService {
  private openvidu: OpenVidu;

  constructor( private configService: ConfigService) {

    const openviduUrl = this.configService.get('OPENVIDU_URL');
    const openviduSecret = this.configService.get('OPENVIDU_SECRET');

    if(!openviduUrl || !openviduSecret) {
      throw new Error("Missing OpenVidu URL or Secret environment variable");
    }

    this.openvidu = new OpenVidu(openviduUrl, openviduSecret)
  }

  async createSession(sessionId: string): Promise<Session> {
    try {
      const session = await this.openvidu.createSession({
        customSessionId: sessionId,
      })
      return session;
    } catch (error) {
      throw new Error("Failed to create OpenVidu session");
    }
  }

  async createToken(sessionId: string): Promise<string> {
    const session = await this.openvidu.activeSessions.find(s => s.sessionId === sessionId);
    if (!session) {
      throw new Error(`sessionId ${sessionId} not found`);
    }
    // createConnection()을 사용하여 연결을 생성하고, 그 안에서 token을 가져옴
    const connection: Connection = await session.createConnection();
    return connection.token;
  }
}