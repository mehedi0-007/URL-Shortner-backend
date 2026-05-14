import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { Response } from 'express';

type logData = { email: string; password: string };
type payload = { sub: string; email: string; role: string };

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async logIn(data: logData, res: Response): Promise<object> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) throw new NotFoundException();

    const isval = await bcrypt.compare(user.password, data.password);

    if (!isval) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email, role: user.role };

    const tokens = await this.getTokens(payload);

    const hashed = await bcrypt.hash(tokens.refresh_token, 11);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refresh: hashed,
      },
    });

    res.cookie('refreshToken', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.PRODUCTION === 'true' ? true : false,
      sameSite: 'lax',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    });

    return { access_token: tokens.access_token };
  }

  async logOut(data: logData): Promise<any> {
    const userData = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!userData) throw new NotFoundException();

    try {
      await this.prisma.user.update({
        where: { id: userData.id },
        data: {
          refresh: null,
        },
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

  async getTokens(payload: payload) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET as string,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESSH_SECRET as string,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
