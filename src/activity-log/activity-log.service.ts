import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async logActivity(
    createActivityLogDto: CreateActivityLogDto,
  ): Promise<ActivityLog> {
    const { type, userId } = createActivityLogDto;

    const log = this.activityLogRepository.create({
      type,
      userId,
    });

    return await this.activityLogRepository.save(log);
  }
}
