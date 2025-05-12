import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyReport } from './entities/daily-report.entity';
import { DailyReportsService } from './daily-reports.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ActivityType } from '../activity-logs/activity-logs.enum';
import * as moment from 'moment';

@Processor('daily-reports')
export class DailyReportsProcessor {
  private readonly logger = new Logger(DailyReportsProcessor.name);

  constructor(
    @InjectRepository(DailyReport)
    private dailyReportRepository: Repository<DailyReport>,
    private dailyReportsService: DailyReportsService,
    private activityLogsService: ActivityLogsService,
  ) {}

  @Process('generate-daily-report')
  async handleDailyReport(job: Job<{ date: Date }>) {
    const { date } = job.data;
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();

    try {
      let report = await this.dailyReportRepository.findOne({
        where: { reportDate: date },
      });

      if (!report) {
        report = this.dailyReportRepository.create({
          reportDate: date,
          totalLogins: 0,
          failedLogins: 0,
          newUsers: 0,
        });
      }

      report.totalLogins = await this.getTotalLogins(startOfDay, endOfDay);
      report.failedLogins = await this.getFailedLogins(startOfDay, endOfDay);
      report.newUsers = await this.getNewUsers(startOfDay, endOfDay);

      await this.dailyReportsService.saveReport(report);

      this.logger.log(`Successfully generated daily report for ${moment(date).format('YYYY-MM-DD')}`);
    } catch (error) {
      this.logger.error(`Failed to generate daily report: ${error.message}`, error);
      throw error;
    }
  }

  private async getTotalLogins(startDate: Date, endDate: Date): Promise<number> {
    return this.activityLogsService.countLogsByTypeSince(
      ActivityType.LOGIN,
      startDate,
    );
  }

  private async getFailedLogins(startDate: Date, endDate: Date): Promise<number> {
    return this.activityLogsService.countLogsByTypeSince(
      ActivityType.FAILED_LOGIN,
      startDate,
    );
  }

  private async getNewUsers(startDate: Date, endDate: Date): Promise<number> {
    return this.activityLogsService.countLogsByTypeSince(
      ActivityType.REGISTRATION,
      startDate,
    );
  }
} 