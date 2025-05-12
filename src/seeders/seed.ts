import { NestFactory } from '@nestjs/core';
import * as moment from 'moment';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { RoleName } from '../roles/role.enum';
import { ActivityType } from '../activity-logs/activity-logs.enum';
import { DailyReportsService } from '../daily-reports/daily-reports.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const rolesService = app.get(RolesService);
  const activityLogsService = app.get(ActivityLogsService);
  const dailyReportsService = app.get(DailyReportsService);

  await rolesService.create({ name: RoleName.USER });
  await rolesService.create({ name: RoleName.ADMIN });

  const sampleUsers = [
    {
      username: 'john',
      email: 'john@example.com',
      password: 'password123',
      roleName: RoleName.USER,
      isActive: true,
    },
    {
      username: 'jane',
      email: 'jane@example.com',
      password: 'secure456',
      roleName: RoleName.USER,
      isActive: true,
    },
    {
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword',
      roleName: RoleName.ADMIN,
      isActive: true,
    },
    {
      username: 'bob',
      email: 'bob@example.com',
      password: 'bobpass123',
      roleName: RoleName.USER,
      isActive: true,
    },
    {
      username: 'alice',
      email: 'alice@example.com',
      password: 'alicepass456',
      roleName: RoleName.USER,
      isActive: true,
    },
  ];

  const activities = {
    john: [
      // Today's activities
      {
        type: ActivityType.REGISTRATION,
        createdAt: moment().subtract(2, 'hours').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(1, 'hours').toDate(),
      },
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(30, 'minutes').toDate(),
      },
      // Yesterday's activities
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(2, 'hours').toDate(),
      },
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(1, 'hours').toDate(),
      },
      // Two days ago
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(2, 'days').subtract(3, 'hours').toDate(),
      },
    ],
    jane: [
      // Today's activities
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(3, 'hours').toDate(),
      },
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(2, 'hours').toDate(),
      },
      // Yesterday's activities
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(4, 'hours').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(2, 'hours').toDate(),
      },
      // Two days ago
      {
        type: ActivityType.REGISTRATION,
        createdAt: moment().subtract(2, 'days').subtract(5, 'hours').toDate(),
      },
    ],
    admin: [
      // Today's activities
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(1, 'hours').toDate(),
      },
      // Yesterday's activities
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(3, 'hours').toDate(),
      },
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(2, 'hours').toDate(),
      },
    ],
    bob: [
      // Today's activities
      {
        type: ActivityType.REGISTRATION,
        createdAt: moment().subtract(4, 'hours').toDate(),
      },
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(3, 'hours').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(2, 'hours').toDate(),
      },
      // Yesterday's activities
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(5, 'hours').toDate(),
      },
    ],
    alice: [
      // Today's activities
      {
        type: ActivityType.REGISTRATION,
        createdAt: moment().subtract(5, 'hours').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(4, 'hours').toDate(),
      },
      // Yesterday's activities
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(6, 'hours').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(1, 'days').subtract(4, 'hours').toDate(),
      },
    ],
  };

  console.log('Starting to seed data...');

  for (const user of sampleUsers) {
    console.log(`Creating user: ${user.username}`);
    const createdUser = await usersService.create(user);

    const userActivities = activities[user.username];

    if (userActivities) {
      console.log(`Adding ${userActivities.length} activities for user: ${user.username}`);
      for (const activity of userActivities) {
        await activityLogsService.logActivity({
          type: activity.type,
          userId: createdUser.id,
          createdAt: activity.createdAt,
        });
      }
    }
  }

  // Add sample daily reports
  console.log('Adding sample daily reports...');
  
  const sampleReports = [
    {
      reportDate: moment().subtract(2, 'days').startOf('day').toDate(),
      totalLogins: 3,
      failedLogins: 2,
      newUsers: 1,
      metadata: {
        activeUsers: 2,
        totalUsers: 3,
        averageSessionDuration: 1800, // 30 minutes in seconds
        peakActiveTime: '14:00',
        deviceStats: {
          desktop: 2,
          mobile: 1,
          tablet: 0
        },
        browserStats: {
          chrome: 2,
          firefox: 1,
          safari: 0
        },
        osStats: {
          windows: 2,
          macos: 1,
          linux: 0
        }
      }
    },
    {
      reportDate: moment().subtract(1, 'days').startOf('day').toDate(),
      totalLogins: 5,
      failedLogins: 3,
      newUsers: 2,
      metadata: {
        activeUsers: 4,
        totalUsers: 5,
        averageSessionDuration: 2400, // 40 minutes in seconds
        peakActiveTime: '15:30',
        deviceStats: {
          desktop: 3,
          mobile: 2,
          tablet: 0
        },
        browserStats: {
          chrome: 3,
          firefox: 1,
          safari: 1
        },
        osStats: {
          windows: 3,
          macos: 1,
          linux: 1
        }
      }
    },
    {
      reportDate: moment().startOf('day').toDate(),
      totalLogins: 4,
      failedLogins: 2,
      newUsers: 2,
      metadata: {
        activeUsers: 5,
        totalUsers: 5,
        averageSessionDuration: 2100, // 35 minutes in seconds
        peakActiveTime: '16:00',
        deviceStats: {
          desktop: 3,
          mobile: 2,
          tablet: 0
        },
        browserStats: {
          chrome: 3,
          firefox: 1,
          safari: 1
        },
        osStats: {
          windows: 3,
          macos: 1,
          linux: 1
        }
      }
    }
  ];

  for (const report of sampleReports) {
    console.log(`Creating report for date: ${moment(report.reportDate).format('YYYY-MM-DD')}`);
    await dailyReportsService.saveReport(report);
  }

  console.log('Seeding completed successfully.');
  await app.close();
}

bootstrap();
