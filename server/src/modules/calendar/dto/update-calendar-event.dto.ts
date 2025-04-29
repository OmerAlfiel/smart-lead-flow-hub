// server/src/modules/calendar/dto/update-calendar-event.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateCalendarEventDto } from './create-calendar-event.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCalendarEventDto extends PartialType(CreateCalendarEventDto) {
  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}