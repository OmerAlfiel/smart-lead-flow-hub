// server/src/modules/calendar/dto/calendar-event-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CalendarEventResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  isAllDay: boolean;

  @ApiProperty({ enum: ['meeting', 'task', 'reminder', 'other'] })
  eventType: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty({ required: false })
  attendees?: Record<string, any>[];

  @ApiProperty({ required: false })
  leadId?: string;

  @ApiProperty({ required: false })
  leadName?: string;

  @ApiProperty()
  createdById: string;

  @ApiProperty()
  createdByName: string;

  @ApiProperty({ enum: ['google', 'office365', 'none'] })
  source: string;

  @ApiProperty()
  isSynced: boolean;

  @ApiProperty({ required: false })
  externalEventId?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}