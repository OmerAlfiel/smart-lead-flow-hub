// server/src/modules/reports/reports.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from './entities/report.entity';
import { ReportRepository } from './repositories/report.repository';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    AnalyticsModule
  ],
  controllers: [ReportsController],
  providers: [ReportsService, ReportRepository],
  exports: [ReportsService],
})
export class ReportsModule {}