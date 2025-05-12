import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { DailyReportsService } from './daily-reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from '../roles/role.enum';

@Controller('daily-reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DailyReportsController {
  constructor(private readonly dailyReportsService: DailyReportsService) {}

  @Get()
  @Roles(RoleName.ADMIN)
  async getDailyReport(@Query('date') dateStr: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    return this.dailyReportsService.getDailyReport(date);
  }

  @Get('recent')
  @Roles(RoleName.ADMIN)
  async getRecentReports(@Query('days') days: number) {
    return this.dailyReportsService.getRecentReports(days);
  }

  @Post('generate')
  @Roles(RoleName.ADMIN)
  async generateReport(@Query('date') dateStr: string) {
    const date = dateStr ? new Date(dateStr) : new Date();
    await this.dailyReportsService.generateDailyReport(date);
    return { message: 'Report generation started' };
  }
} 