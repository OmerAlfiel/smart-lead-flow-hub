// server/src/modules/reports/reports.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportStatus, ReportType } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportRepository } from './repositories/report.repository';
import { AnalyticsService } from '../analytics/analytics.service';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    private reportRepository: ReportRepository,
    private analyticsService: AnalyticsService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<Report> {
    const report = this.reportsRepository.create({
      name: createReportDto.name,
      type: createReportDto.type,
      format: createReportDto.format,
      parameters: createReportDto.parameters,
      scheduledAt: createReportDto.scheduledAt ? new Date(createReportDto.scheduledAt) : null,
      createdById: createReportDto.createdById,
      recipients: createReportDto.recipients,
      isRecurring: createReportDto.isRecurring,
      recurringPattern: createReportDto.recurringPattern,
      status: ReportStatus.SCHEDULED,
    });
    
    return this.reportsRepository.save(report);
  }

  async findAll(): Promise<Report[]> {
    return this.reportsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Report[]> {
    return this.reportRepository.findByUser(userId);
  }

  async findOne(id: string): Promise<Report> {
    const report = await this.reportsRepository.findOne({ where: { id } });
    
    if (!report) {
      throw new NotFoundException(`Report with ID ${id} not found`);
    }
    
    return report;
  }

  async update(id: string, updateReportDto: UpdateReportDto): Promise<Report> {
    const report = await this.findOne(id);
    
    // Update fields
    Object.assign(report, updateReportDto);
    
    return this.reportsRepository.save(report);
  }

  async remove(id: string): Promise<void> {
    const report = await this.findOne(id);
    
    // If report has a file, delete it
    if (report.filePath && fs.existsSync(path.join(process.cwd(), report.filePath))) {
      fs.unlinkSync(path.join(process.cwd(), report.filePath));
    }
    
    await this.reportsRepository.remove(report);
  }

  async generateReport(id: string): Promise<Report> {
    const report = await this.findOne(id);
    
    // Update status to processing
    report.status = ReportStatus.PROCESSING;
    await this.reportsRepository.save(report);
    
    try {
      // Generate report content based on type
      let reportData: any;
      
      switch (report.type) {
        case ReportType.LEAD_PERFORMANCE:
          reportData = await this.analyticsService.getLeadSummary(
            report.parameters?.startDate,
            report.parameters?.endDate
          );
          break;
        case ReportType.CONVERSION_RATES:
          reportData = await this.analyticsService.getConversionRates(
            report.parameters?.startDate,
            report.parameters?.endDate
          );
          break;
        case ReportType.WEEKLY:
        case ReportType.MONTHLY:
          reportData = await this.analyticsService.getDashboardStats(
            report.parameters?.userId
          );
          break;
        case ReportType.TEAM_PERFORMANCE:
          // Implement team performance report generation
          reportData = { message: 'Team performance report data would be generated here' };
          break;
        case ReportType.SALES_FORECAST:
          // Implement sales forecast report generation
          reportData = { message: 'Sales forecast report data would be generated here' };
          break;
        default:
          reportData = { message: 'Custom report data would be generated here' };
      }
      
      // Create directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'uploads', 'reports');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      // Save report to file
      const fileName = `report-${uuidv4()}.json`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));
      
      // Update report with file info
      report.filePath = `uploads/reports/${fileName}`;
      report.fileSize = fs.statSync(filePath).size;
      report.lastRunAt = new Date();
      report.status = ReportStatus.COMPLETED;
      
      return this.reportsRepository.save(report);
    } catch (error) {
      // Update status to failed
      report.status = ReportStatus.FAILED;
      await this.reportsRepository.save(report);
      throw new BadRequestException(`Failed to generate report: ${error.message}`);
    }
  }

  async processScheduledReports(): Promise<void> {
    const scheduledReports = await this.reportRepository.findScheduledReports();
    
    for (const report of scheduledReports) {
      await this.generateReport(report.id);
      
      // If report is recurring, schedule the next run
      if (report.isRecurring && report.recurringPattern) {
        const [frequency, intervalStr] = report.recurringPattern.split(':');
        const interval = parseInt(intervalStr, 10);
        
        if (isNaN(interval)) {
          continue;
        }
        
        const nextScheduledAt = new Date(report.scheduledAt);
        
        switch (frequency.toUpperCase()) {
          case 'DAILY':
            nextScheduledAt.setDate(nextScheduledAt.getDate() + interval);
            break;
          case 'WEEKLY':
            nextScheduledAt.setDate(nextScheduledAt.getDate() + (interval * 7));
            break;
          case 'MONTHLY':
            nextScheduledAt.setMonth(nextScheduledAt.getMonth() + interval);
            break;
          case 'YEARLY':
            nextScheduledAt.setFullYear(nextScheduledAt.getFullYear() + interval);
            break;
        }
        
        report.scheduledAt = nextScheduledAt;
        report.status = ReportStatus.SCHEDULED;
        await this.reportsRepository.save(report);
      }
    }
  }
}