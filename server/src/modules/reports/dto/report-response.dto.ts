// server/src/modules/reports/dto/report-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ReportType, ReportStatus, ReportFormat } from '../entities/report.entity';

export class ReportResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Weekly Sales Report' })
  name: string;

  @ApiProperty({ enum: ReportType, example: ReportType.WEEKLY })
  type: ReportType;

  @ApiProperty({ enum: ReportStatus, example: ReportStatus.COMPLETED })
  status: ReportStatus;

  @ApiProperty({ enum: ReportFormat, example: ReportFormat.PDF })
  format: ReportFormat;

  @ApiProperty({ 
    example: { 
      startDate: '2025-04-01', 
      endDate: '2025-04-30',
      includeLeads: true,
      includeConversions: true 
    }
  })
  parameters: Record<string, any>;

  @ApiProperty({ example: '2025-05-01T09:00:00.000Z' })
  scheduledAt: Date;

  @ApiProperty({ example: '2025-05-01T09:15:00.000Z' })
  lastRunAt: Date;

  @ApiProperty({ example: '/uploads/reports/report-123.pdf' })
  filePath: string;

  @ApiProperty({ example: 1024000 })
  fileSize: number;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  createdById: string;

  @ApiProperty({ example: ['user1@example.com', 'user2@example.com'] })
  recipients: string[];

  @ApiProperty({ example: true })
  isRecurring: boolean;

  @ApiProperty({ example: 'WEEKLY:1' })
  recurringPattern: string;

  @ApiProperty({ example: '2025-04-29T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-04-29T10:00:00.000Z' })
  updatedAt: Date;
}