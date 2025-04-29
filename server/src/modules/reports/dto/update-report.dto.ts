// server/src/modules/reports/dto/update-report.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateReportDto } from './create-report.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReportStatus } from '../entities/report.entity';

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @ApiProperty({ enum: ReportStatus, required: false })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;
}