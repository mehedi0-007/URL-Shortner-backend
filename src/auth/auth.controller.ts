import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

type loginBody = { email: string; password: string };

type payload = {
  sub: string;
  email: string;
  role: string;
  name: string;
  refresh_token?: string;
};

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async userLogIn(
    @Body() body: loginBody,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logIn(body, res);
  }

  @Post('refresh')
  @UseGuards(RefreshAuthGuard)
  async refreshToken(@Req() req: Request): Promise<any> {
    const payload = req.user;
    if (!payload) throw new UnauthorizedException();

    return this.authService.refresh(payload as payload);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async userLogOut(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    await this.authService.logOut(req.user as payload, res);
    return { msg: 'User logout success' };
  }
}
