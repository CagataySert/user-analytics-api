import { Module } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics.service';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { UsersModule } from '../users/users.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';

@Module({
  imports: [UsersModule, ActivityLogsModule],
  providers: [AdminAnalyticsService],
  controllers: [AdminAnalyticsController],
})
export class AdminAnalyticsModule {}
