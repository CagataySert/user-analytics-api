import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyReportsService } from './daily-reports.service';
import * as moment from 'moment';

@Injectable()
export class DailyReportsScheduler {
  private readonly logger = new Logger(DailyReportsScheduler.name);

  constructor(private readonly dailyReportsService: DailyReportsService) {}

  // For testing: Run every minute
  // @Cron('* * * * *')
  // For production: Run at midnight
   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyReport() {
    try {
      const yesterday = moment().subtract(1, 'days').startOf('day').toDate();
      
      this.logger.log(`[Scheduler] Starting scheduled daily report generation for ${moment(yesterday).format('YYYY-MM-DD')}`);
      
      // Check if report already exists
      const existingReport = await this.dailyReportsService.getDailyReport(yesterday);
      if (existingReport) {
        console.log(existingReport, 'existingReport');
        this.logger.log(`[Scheduler] Report for ${moment(yesterday).format('YYYY-MM-DD')} already exists, skipping generation`);
        return;
      }

      await this.dailyReportsService.generateDailyReport(yesterday);
      this.logger.log(`[Scheduler] Daily report generation completed successfully for ${moment(yesterday).format('YYYY-MM-DD')}`);
    } catch (error) {
      this.logger.error(`[Scheduler] Failed to generate daily report: ${error.message}`, error);
    }
  }
} 