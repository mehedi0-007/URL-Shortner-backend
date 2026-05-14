import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

type pld = { sub: string; email: string; role: string };

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies?.refreshToken as string;
      },
      secretOrKey: process.env.JWT_REFRESSH_SECRET as string,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: pld) {
    const rft = req.cookies?.refreshToken as string;
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) throw new NotFoundException();

    const isValid = await bcrypt.compare(rft, user.refresh ? user.refresh : '');
    if (!isValid) throw new UnauthorizedException();

    return { ...payload, rft };
  }
}
