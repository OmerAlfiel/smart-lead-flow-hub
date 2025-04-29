// server/src/modules/audit-logs/dto/query-audit-logs.dto.ts
import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityType, ActionType } from '../entities/audit-log.entity';

export class QueryAuditLogsDto {
  @ApiProperty({ 
    enum: ['lead', 'task', 'user', 'note', 'campaign', 'integration', 'team', 'file'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['lead', 'task', 'user', 'note', 'campaign', 'integration', 'team', 'file'])
  entityType?: EntityType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiProperty({ 
    enum: ['create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'import'],
    required: false 
  })
  @IsOptional()
  @IsEnum(['create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'import'])
  action?: ActionType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: '2023-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2023-01-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}