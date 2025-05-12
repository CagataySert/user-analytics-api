import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { DailyReport } from './entities/daily-report.entity';
import { DailyReportsService } from './daily-reports.service';
import { DailyReportsController } from './daily-reports.controller';
import { DailyReportsProcessor } from './daily-reports.processor';
import { DailyReportsScheduler } from './daily-reports.scheduler';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyReport]),
    BullModule.registerQueue({
      name: 'daily-reports',
    }),
    ActivityLogsModule,
    CommonModule,
  ],
  controllers: [DailyReportsController],
  providers: [DailyReportsService, DailyReportsProcessor, DailyReportsScheduler],
  exports: [DailyReportsService],
})
export class DailyReportsModule {} 