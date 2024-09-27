// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.findOneByEmail(username);
        const auth_result = await bcrypt.compare(password, user.password);
        if (user && auth_result) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateToken(token: any) {
        try {
            const decoded = this.jwtService.verify(token, {
                ignoreExpiration: false,
            });
            const user = await this.userService.findOneByEmail(decoded.email);

            if (!user) {
                throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
            }

            const payload = { email: user.email, sub: user.id };
            return {
                access_token: this.jwtService.sign(payload),
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            throw new UnauthorizedException('유효하지 않은 Refresh Token입니다.');
        }
    }
}