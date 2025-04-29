// server/src/modules/tasks/dto/create-task.dto.ts
import { IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Follow up with client' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Discuss pricing and timeline', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-05-15', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 'medium', enum: ['low', 'medium', 'high'] })
  @IsEnum(['low', 'medium', 'high'])
  priority: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  assignedToId?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  leadId?: string;
}