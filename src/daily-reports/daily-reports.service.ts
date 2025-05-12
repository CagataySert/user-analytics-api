import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DailyReport } from './entities/daily-report.entity';
import { RedisCacheService } from '../common/services/redis-cache.service';
import * as moment from 'moment';

@Injectable()
export class DailyReportsService {
  constructor(
    @InjectRepository(DailyReport)
    private dailyReportRepository: Repository<DailyReport>,
    @InjectQueue('daily-reports') private reportsQueue: Queue,
    private readonly redisCache: RedisCacheService,
  ) {}

  async generateDailyReport(date: Date = new Date()): Promise<void> {
    await this.reportsQueue.add('generate-daily-report', { date });
  }

  async getDailyReport(date: Date): Promise<DailyReport | null> {
    // Try to get from Redis cache first
    const cacheKey = `daily-report:${moment(date).format('YYYY-MM-DD')}`;
    const cachedReport = await this.redisCache.get<DailyReport>(cacheKey);
    
    if (cachedReport) {
      return cachedReport;
    }

    // If not in cache, get from database
    const report = await this.dailyReportRepository.findOne({
      where: { reportDate: date },
    });

    if (report) {
      // Cache the report for 1 hour
      await this.redisCache.set(cacheKey, report, 3600);
    }

    return report;
  }

  async saveReport(report: Partial<DailyReport>): Promise<DailyReport> {
    const savedReport = await this.dailyReportRepository.save(report);
    
    // Update cache
    const cacheKey = `daily-report:${moment(savedReport.reportDate).format('YYYY-MM-DD')}`;
    await this.redisCache.set(cacheKey, savedReport, 3600);
    
    return savedReport;
  }

  async getRecentReports(days: number = 7): Promise<DailyReport[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.dailyReportRepository.find({
      where: {
        reportDate: MoreThanOrEqual(startDate),
      },
      order: {
        reportDate: 'DESC',
      },
    });
  }
} 