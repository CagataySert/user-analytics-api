import { Module } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { UsersModule } from '../users/users.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [UsersModule, ActivityLogsModule, CommonModule],
  providers: [AdminAnalyticsService],
  controllers: [AdminAnalyticsController],
  exports: [AdminAnalyticsService],
})
export class AdminAnalyticsModule {}
