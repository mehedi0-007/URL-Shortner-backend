import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserInfo } from 'src/common/decorator/user.decorator';
import { Role } from 'src/auth/decorators/roles/roles.enum';
import { Roles } from 'src/auth/decorators/roles/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role/role.guard';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('user/overview')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async userOverview(@UserInfo('sub') userId: string) {
    return this.dashboard.getUserOverview(userId);
  }

  @Get('user/urls')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async userUrls(
    @UserInfo('sub') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.dashboard.getUserUrls(userId, page, limit);
  }

  @Get('user/:id')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async userAnalytics(
    @Param('id') id: string,
    @UserInfo('sub') userId: string,
  ) {
    return this.dashboard.getUserAnalytics(userId, id);
  }

  @Get('admin/overview')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async adminOverview() {
    return this.dashboard.getAdminOverview();
  }

  @Get('admin/users')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async adminAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.dashboard.getAllUsers(page, limit);
  }
}
