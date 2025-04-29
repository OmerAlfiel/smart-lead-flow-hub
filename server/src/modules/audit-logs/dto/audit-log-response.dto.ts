// server/src/modules/audit-logs/dto/audit-log-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { EntityType, ActionType } from '../entities/audit-log.entity';

export class AuditLogResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ enum: ['lead', 'task', 'user', 'note', 'campaign', 'integration', 'team', 'file'], example: 'lead' })
  entityType: EntityType;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  entityId?: string;

  @ApiProperty({ enum: ['create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'import'], example: 'create' })
  action: ActionType;

  @ApiProperty({ example: 'User created a new lead', required: false })
  description?: string;

  @ApiProperty({ type: Object, required: false })
  oldValues?: Record<string, any>;

  @ApiProperty({ type: Object, required: false })
  newValues?: Record<string, any>;

  @ApiProperty({ example: '192.168.1.1', required: false })
  ipAddress?: string;

  @ApiProperty({ example: 'Mozilla/5.0...', required: false })
  userAgent?: string;

  @ApiProperty({ example: { id: '123e4567-e89b-12d3-a456-426614174000', email: 'user@example.com' }, required: false })
  user?: {
    id: string;
    email: string;
    displayName?: string;
  };

  @ApiProperty({ example: '2023-01-01T12:00:00Z' })
  createdAt: Date;
}