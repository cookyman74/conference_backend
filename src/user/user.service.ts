import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async findUserAll() {
    return this.prismaService.user.findMany();
  }

  async findOneByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      throw new NotFoundException('해당 이메일의 사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
