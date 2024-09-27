import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoomService } from './room.service';

@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  create(@Body() createRoomDto: { name: string }) {
    return this.roomService.createRoom({ name: createRoomDto.name });
  }

  @Get()
  findAll() {
    return this.roomService.rooms({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.room({ id: Number(id) });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.deleteRoom({ id: Number(id) });
  }

}