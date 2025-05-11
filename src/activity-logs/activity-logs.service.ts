import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Not, IsNull } from 'typeorm';
import { ActivityLog } from './activity-logs.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { ActivityType } from './activity-logs.enum';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async logActivity(
    createActivityLogDto: CreateActivityLogDto,
  ): Promise<ActivityLog> {
    const { type, userId, description, createdAt } = createActivityLogDto;

    const log = this.activityLogRepository.create({
      type,
      userId,
      description,
      createdAt: createdAt || new Date(),
    });

    return await this.activityLogRepository.save(log);
  }

  async countDistinctUserIdsByTypeSince(
    type: ActivityType,
    startDate: Date,
  ): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await this.activityLogRepository
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT log.userId)', 'count')
      .where('log.type = :type', { type })
      .andWhere('log.createdAt >= :startDate', { startDate })
      .andWhere('log.userId IS NOT NULL')
      .getRawOne();

    return Number(result.count);
  }

  async countLogsByTypeSince(
    type: ActivityType,
    startDate: Date,
  ): Promise<number> {
    return this.activityLogRepository.count({
      where: {
        type,
        createdAt: Between(startDate, new Date()),
        userId: Not(IsNull()),
      },
    });
  }
}
