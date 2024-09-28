import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OpenviduService } from './openvidu.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('openvidu')
@UseGuards(AuthGuard('jwt'))
export class OpenviduController {
  constructor(private readonly openviduService: OpenviduService) {}

  @Post('session')
  async createSession(@Body() body: { sessionId: string }) {
    const session = await this.openviduService.createSession(body.sessionId);
    return { sesionId: session.sessionId };
  }

  @Post('tokens')
  async createToken(@Body() body: { sessionId: string }) {
    const token = await this.openviduService.createToken(body.sessionId);
    return { token };
  }
}