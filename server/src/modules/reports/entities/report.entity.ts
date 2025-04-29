// server/src/modules/reports/entities/report.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum ReportType {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
  LEAD_PERFORMANCE = 'lead_performance',
  CONVERSION_RATES = 'conversion_rates',
  TEAM_PERFORMANCE = 'team_performance',
  SALES_FORECAST = 'sales_forecast'
}

export enum ReportStatus {
  SCHEDULED = 'scheduled',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum ReportFormat {
  PDF = 'pdf',
  CSV = 'csv',
  EXCEL = 'excel',
  HTML = 'html'
}

@Entity('reports')
export class Report extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: ReportType, default: ReportType.WEEKLY })
  type: ReportType;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.SCHEDULED })
  status: ReportStatus;

  @Column({ type: 'enum', enum: ReportFormat, default: ReportFormat.PDF })
  format: ReportFormat;

  @Column({ type: 'jsonb', nullable: true })
  parameters: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastRunAt: Date;

  @Column({ nullable: true })
  filePath: string;

  @Column({ nullable: true })
  fileSize: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @Column({ type: 'jsonb', nullable: true })
  recipients: string[];

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ nullable: true })
  recurringPattern: string;
}