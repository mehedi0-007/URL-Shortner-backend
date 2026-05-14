import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import 'dotenv/config';

type JWTPayload = { sub: string; email: string; role: string };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userServices: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      secretOrKey: process.env.JWT_ACCESS_SECRET as string,
    });
  }

  validate(payload: JWTPayload) {
    return payload;
  }
}
