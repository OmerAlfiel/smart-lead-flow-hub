// server/src/modules/reports/repositories/report.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Report, ReportStatus } from '../entities/report.entity';

@Injectable()
export class ReportRepository extends Repository<Report> {
  constructor(private dataSource: DataSource) {
    super(Report, dataSource.createEntityManager());
  }

  async findByUser(userId: string): Promise<Report[]> {
    return this.createQueryBuilder('report')
      .where('report.createdById = :userId', { userId })
      .orderBy('report.createdAt', 'DESC')
      .getMany();
  }

  async findScheduledReports(): Promise<Report[]> {
    return this.createQueryBuilder('report')
      .where('report.status = :status', { status: ReportStatus.SCHEDULED })
      .andWhere('report.scheduledAt <= :now', { now: new Date() })
      .getMany();
  }

  async findRecurringReports(): Promise<Report[]> {
    return this.createQueryBuilder('report')
      .where('report.isRecurring = :isRecurring', { isRecurring: true })
      .getMany();
  }
}