// server/src/modules/reports/report-scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReportsService } from './reports.service';

@Injectable()
export class ReportSchedulerService {
  private readonly logger = new Logger(ReportSchedulerService.name);
  
  constructor(private readonly reportsService: ReportsService) {}
  
  @Cron(CronExpression.EVERY_HOUR)
  async handleScheduledReports() {
    this.logger.log('Processing scheduled reports');
    try {
      await this.reportsService.processScheduledReports();
      this.logger.log('Scheduled reports processed successfully');
    } catch (error) {
      this.logger.error(`Error processing scheduled reports: ${error.message}`);
    }
  }
}