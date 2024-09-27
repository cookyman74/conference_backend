import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async room(roomWhereUniqueInput: Prisma.RoomWhereUniqueInput) {
    return this.prismaService.room.findUnique({
      where: roomWhereUniqueInput,
    });
  }

  async rooms(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoomWhereUniqueInput;
    where?: Prisma.RoomWhereInput;
    orderBy?: Prisma.RoomOrderByWithRelationInput;
  }) {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.room.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createRoom(data: Prisma.RoomCreateInput) {
    return this.prismaService.room.create({
      data,
    });
  }

  async updateRoom(params: {
    where: Prisma.RoomWhereUniqueInput;
    data: Prisma.RoomUpdateInput;
  }) {
    const { where, data } = params;
    return this.prismaService.room.update({
      data,
      where,
    });
  }

  async deleteRoom(where: Prisma.RoomWhereUniqueInput) {
    return this.prismaService.room.delete({
      where,
    });
  }
}
