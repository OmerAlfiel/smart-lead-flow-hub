// server/src/modules/calendar/calendar.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CalendarEventRepository } from './repositories/calendar-event.repository';
import { User } from '../users/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CalendarEvent, User, Lead])],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarEventRepository],
  exports: [CalendarService],
})
export class CalendarModule {}