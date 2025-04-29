// server/src/modules/calendar/dto/create-calendar-event.dto.ts
import { IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsEnum, IsArray, IsUUID, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class AttendeeDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}

export class CreateCalendarEventDto {
  @ApiProperty({ example: 'Sales Meeting with ABC Corp' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Discuss new product features and pricing', required: false })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '2025-05-15T10:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: '2025-05-15T11:00:00Z' })
  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isAllDay?: boolean;

  @ApiProperty({ example: 'meeting', enum: ['meeting', 'task', 'reminder', 'other'], required: false })
  @IsOptional()
  @IsEnum(['meeting', 'task', 'reminder', 'other'])
  eventType?: string;

  @ApiProperty({ example: 'Conference Room A', required: false })
  @IsOptional()
  location?: string;

  @ApiProperty({ 
    type: [AttendeeDto], 
    example: [{ name: 'John Doe', email: 'john@example.com', isRequired: true }],
    required: false 
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendeeDto)
  attendees?: AttendeeDto[];

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  leadId?: string;

  @ApiProperty({ example: 'none', enum: ['google', 'office365', 'none'], required: false })
  @IsOptional()
  @IsEnum(['google', 'office365', 'none'])
  source?: string;

  @ApiProperty({ example: 'abc123', required: false })
  @IsOptional()
  externalEventId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  metadata?: Record<string, any>;
}