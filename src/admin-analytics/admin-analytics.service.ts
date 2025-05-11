import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityType } from '../activity-logs/activity-logs.enum';
import { DateHelper } from '../common/helpers/date.helper';
import { TimeRange } from '../common/constants/time-range.constant';
import { DashboardAnalyticsDto } from './dto/dashboard-analytics.dto';

@Injectable()
export class AdminAnalyticsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async getTotalNumberOfUsers(): Promise<number> {
    return this.usersService.getTotalUserCount();
  }

  async getAdminMetrics(): Promise<DashboardAnalyticsDto> {
    const last7Days = DateHelper.getDateFromRange(TimeRange.LAST_7_DAYS);
    const last24Hours = DateHelper.getDateFromRange(TimeRange.LAST_24_HOURS);

    const [
      totalUsers,
      activeUsersLast7Days,
      failedLoginAttemptsLast24Hours,
      newUsersLast7Days,
    ] = await Promise.all([
      this.usersService.getTotalUserCount(),
      this.activityLogsService.countDistinctUserIdsByTypeSince(
        ActivityType.LOGIN,
        last7Days,
      ),
      this.activityLogsService.countLogsByTypeSince(
        ActivityType.FAILED_LOGIN,
        last24Hours,
      ),
      this.activityLogsService.countLogsByTypeSince(
        ActivityType.REGISTRATION,
        last7Days,
      ),
    ]);

    return {
      totalUsers,
      activeUsersLast7Days,
      failedLoginAttemptsLast24Hours,
      newUsersLast7Days,
    };
  }
}
