import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { UrlModule } from './url/url.module';
import { AuthModule } from './auth/auth.module';
import { LoggerInterceptor } from './interceptors/logger/logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, UserModule, UrlModule, AuthModule, DashboardModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
  ],
})
export class AppModule {}
