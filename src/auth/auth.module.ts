import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
