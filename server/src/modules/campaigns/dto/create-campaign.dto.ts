import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDate, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Summer Promotion 2025' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Special discount campaign for summer season' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-06-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiPropertyOptional({ example: '2025-08-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ example: 'draft', enum: ['draft', 'active', 'paused', 'completed'] })
  @IsOptional()
  @IsEnum(['draft', 'active', 'paused', 'completed'])
  status?: string;

  @ApiPropertyOptional({ example: { emailTemplate: 'summer_promo', targetAudience: 'all' } })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @ApiPropertyOptional({ example: { sentEmails: 0, openRate: 0, clickRate: 0 } })
  @IsOptional()
  @IsObject()
  metrics?: Record<string, any>;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  createdById?: string;
}