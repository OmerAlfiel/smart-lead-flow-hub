// server/src/modules/analytics/dto/analytics-query.dto.ts
import { IsOptional, IsDateString } from 'class-validator';

export class AnalyticsQueryDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  campaignId?: string;
}