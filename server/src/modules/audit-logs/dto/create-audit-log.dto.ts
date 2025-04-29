// server/src/modules/audit-logs/dto/create-audit-log.dto.ts
import { IsEnum, IsOptional, IsUUID, IsString, IsObject, IsIP } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityType, ActionType } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @ApiProperty({ 
    enum: ['lead', 'task', 'user', 'note', 'campaign', 'integration', 'team', 'file'],
    example: 'lead' 
  })
  @IsEnum(['lead', 'task', 'user', 'note', 'campaign', 'integration', 'team', 'file'])
  entityType: EntityType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiProperty({ 
    enum: ['create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'import'],
    example: 'create' 
  })
  @IsEnum(['create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'import'])
  action: ActionType;

  @ApiProperty({ example: 'User created a new lead', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  oldValues?: Record<string, any>;

  @ApiProperty({ type: Object, required: false })
  @IsOptional()
  @IsObject()
  newValues?: Record<string, any>;

  @ApiProperty({ example: '192.168.1.1', required: false })
  @IsOptional()
  @IsIP()
  ipAddress?: string;

  @ApiProperty({ example: 'Mozilla/5.0...', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  userId?: string;
}