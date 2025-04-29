// server/src/modules/activities/dto/create-activity.dto.ts
import { IsNotEmpty, IsOptional, IsUUID, IsEnum, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ example: 'created_lead' })
  @IsNotEmpty()
  @IsString()
  action: string;

  @ApiProperty({ example: 'Created a new lead for Acme Inc.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'lead', enum: ['lead', 'task', 'user', 'integration', 'system'] })
  @IsEnum(['lead', 'task', 'user', 'integration', 'system'])
  entityType: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({ example: { leadName: 'Acme Inc.' } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}