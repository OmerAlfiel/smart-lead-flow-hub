// server/src/modules/reports/dto/create-report.dto.ts
import { IsNotEmpty, IsEnum, IsOptional, IsArray, IsBoolean, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportType, ReportFormat } from '../entities/report.entity';

export class CreateReportDto {
  @ApiProperty({ example: 'Weekly Sales Report' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ReportType, example: ReportType.WEEKLY })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ enum: ReportFormat, example: ReportFormat.PDF })
  @IsEnum(ReportFormat)
  format: ReportFormat;

  @ApiProperty({ 
    example: { 
      startDate: '2025-04-01', 
      endDate: '2025-04-30',
      includeLeads: true,
      includeConversions: true 
    },
    required: false
  })
  @IsOptional()
  parameters?: Record<string, any>;

  @ApiProperty({ example: '2025-05-01T09:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiProperty({ example: ['user1@example.com', 'user2@example.com'], required: false })
  @IsOptional()
  @IsArray()
  recipients?: string[];

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @ApiProperty({ example: 'WEEKLY:1', required: false, description: 'Format: FREQUENCY:INTERVAL, e.g., WEEKLY:1 for every week, MONTHLY:2 for every 2 months' })
  @IsOptional()
  @IsString()
  recurringPattern?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsString()
  createdById: string;
}