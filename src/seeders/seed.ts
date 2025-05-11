import { NestFactory } from '@nestjs/core';
import * as moment from 'moment';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { RoleName } from '../roles/role.enum';
import { ActivityType } from '../activity-logs/activity-logs.enum';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const rolesService = app.get(RolesService);
  const activityLogsService = app.get(ActivityLogsService);

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
  ];

  const activities = {
    john: [
      {
        type: ActivityType.REGISTRATION,
        createdAt: moment().subtract(6, 'hours').toDate(),
      },
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(4, 'days').toDate(),
      },
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(4, 'hours').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(19, 'days').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(8, 'days').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(2, 'hours').toDate(),
      },
    ],
    jane: [
      {
        type: ActivityType.REGISTRATION,
        createdAt: moment().subtract(15, 'days').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(10, 'days').toDate(),
      },
      {
        type: ActivityType.FAILED_LOGIN,
        createdAt: moment().subtract(7, 'days').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(5, 'days').toDate(),
      },
      {
        type: ActivityType.LOGIN,
        createdAt: moment().subtract(3, 'days').toDate(),
      },
    ],
  };

  for (const user of sampleUsers) {
    const createdUser = await usersService.create(user);

    const userActivities = activities[user.username];

    if (userActivities) {
      for (const activity of userActivities) {
        await activityLogsService.logActivity({
          type: activity.type,
          userId: createdUser.id,
          createdAt: activity.createdAt,
        });
      }
    }
  }

  console.log('Seeding completed.');
  await app.close();
}

bootstrap();
