import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/role.enum';

@Controller('admin-analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMIN)
export class AdminAnalyticsController {
  constructor(private readonly adminService: AdminAnalyticsService) {}

  @Get('metrics')
  async getAdminMetrics() {
    return await this.adminService.getAdminMetrics();
  }
}
