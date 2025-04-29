import { IsNotEmpty, IsOptional, IsString, IsEnum, IsBoolean, IsObject, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'New Lead Assigned' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'A new lead has been assigned to you.' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiPropertyOptional({ example: 'info', enum: ['info', 'success', 'warning', 'error'] })
  @IsOptional()
  @IsEnum(['info', 'success', 'warning', 'error'])
  type?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isRead?: boolean;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ example: { leadId: '123e4567-e89b-12d3-a456-426614174000' } })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}