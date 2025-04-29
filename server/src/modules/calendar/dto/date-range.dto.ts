// server/src/modules/calendar/dto/date-range.dto.ts
import { IsDateString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DateRangeDto {
  @ApiProperty({ example: '2025-05-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-05-31T23:59:59Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;
}