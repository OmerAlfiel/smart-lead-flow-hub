// server/src/modules/calendar/calendar.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from './entities/calendar-event.entity';
import { CalendarEventRepository } from './repositories/calendar-event.repository';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { CalendarEventResponseDto } from './dto/calendar-event-response.dto';
import { User } from '../users/entities/user.entity';
import { Lead } from '../leads/entities/lead.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEvent)
    private calendarEventRepository: Repository<CalendarEvent>,
    private calendarRepository: CalendarEventRepository,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
  ) {}

  async create(createCalendarEventDto: CreateCalendarEventDto, userId: string): Promise<CalendarEventResponseDto> {
    // Validate dates
    const startTime = new Date(createCalendarEventDto.startTime);
    const endTime = new Date(createCalendarEventDto.endTime);
    
    if (endTime <= startTime) {
      throw new BadRequestException('End time must be after start time');
    }
    
    // Create new event
    const event = this.calendarEventRepository.create({
      ...createCalendarEventDto,
      startTime,
      endTime,
      createdById: userId,
    });
    
    // Save the event
    const savedEvent = await this.calendarEventRepository.save(event);
    
    // Return formatted response
    return this.formatEventResponse(savedEvent);
  }

  async findAll(userId: string): Promise<CalendarEventResponseDto[]> {
    const events = await this.calendarRepository.findByUser(userId);
    return Promise.all(events.map(event => this.formatEventResponse(event)));
  }

  async findByDateRange(dateRangeDto: DateRangeDto): Promise<CalendarEventResponseDto[]> {
    const startDate = new Date(dateRangeDto.startDate);
    const endDate = new Date(dateRangeDto.endDate);
    
    if (endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }
    
    const events = await this.calendarRepository.findByDateRange(
      startDate, 
      endDate, 
      dateRangeDto.userId
    );
    
    return Promise.all(events.map(event => this.formatEventResponse(event)));
  }

  async findOne(id: string): Promise<CalendarEventResponseDto> {
    const event = await this.calendarEventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'lead'],
    });
    
    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }
    
    return this.formatEventResponse(event);
  }

  async findByLead(leadId: string): Promise<CalendarEventResponseDto[]> {
    const events = await this.calendarRepository.findByLead(leadId);
    return Promise.all(events.map(event => this.formatEventResponse(event)));
  }

  async findUpcoming(userId: string, limit: number = 5): Promise<CalendarEventResponseDto[]> {
    const events = await this.calendarRepository.findUpcomingEvents(userId, limit);
    return Promise.all(events.map(event => this.formatEventResponse(event)));
  }

  async update(id: string, updateCalendarEventDto: UpdateCalendarEventDto): Promise<CalendarEventResponseDto> {
    const event = await this.calendarEventRepository.findOne({
      where: { id },
      relations: ['createdBy', 'lead'],
    });
    
    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }
    
    // Validate dates if both are provided
    if (updateCalendarEventDto.startTime && updateCalendarEventDto.endTime) {
      const startTime = new Date(updateCalendarEventDto.startTime);
      const endTime = new Date(updateCalendarEventDto.endTime);
      
      if (endTime <= startTime) {
        throw new BadRequestException('End time must be after start time');
      }
    } else if (updateCalendarEventDto.startTime) {
      const startTime = new Date(updateCalendarEventDto.startTime);
      
      if (event.endTime <= startTime) {
        throw new BadRequestException('End time must be after start time');
      }
    } else if (updateCalendarEventDto.endTime) {
      const endTime = new Date(updateCalendarEventDto.endTime);
      
      if (endTime <= event.startTime) {
        throw new BadRequestException('End time must be after start time');
      }
    }
    
    // Update event
    Object.assign(event, updateCalendarEventDto);
    
    // Convert date strings to Date objects if provided
    if (updateCalendarEventDto.startTime) {
      event.startTime = new Date(updateCalendarEventDto.startTime);
    }
    
    if (updateCalendarEventDto.endTime) {
      event.endTime = new Date(updateCalendarEventDto.endTime);
    }
    
    // Save updated event
    const updatedEvent = await this.calendarEventRepository.save(event);
    
    return this.formatEventResponse(updatedEvent);
  }

  async remove(id: string): Promise<void> {
    const event = await this.calendarEventRepository.findOne({
      where: { id },
    });
    
    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }
    
    // Soft delete
    event.isActive = false;
    await this.calendarEventRepository.save(event);
  }

  async syncExternalEvent(externalEvent: any, source: string, userId: string): Promise<CalendarEventResponseDto> {
    // Check if event already exists
    let event = await this.calendarRepository.findByExternalId(externalEvent.id, source);
    
    if (event) {
      // Update existing event
      event.title = externalEvent.summary || 'Untitled Event';
      event.description = externalEvent.description;
      event.startTime = new Date(externalEvent.start.dateTime || externalEvent.start.date);
      event.endTime = new Date(externalEvent.end.dateTime || externalEvent.end.date);
      event.isAllDay = !externalEvent.start.dateTime;
      event.location = externalEvent.location;
      event.isSynced = true;
      event.metadata = externalEvent;
      
      if (externalEvent.attendees) {
        event.attendees = externalEvent.attendees.map(attendee => ({
          name: attendee.displayName || attendee.email,
          email: attendee.email,
          isRequired: !attendee.optional,
        }));
      }
    } else {
      // Create new event
      event = this.calendarEventRepository.create({
        title: externalEvent.summary || 'Untitled Event',
        description: externalEvent.description,
        startTime: new Date(externalEvent.start.dateTime || externalEvent.start.date),
        endTime: new Date(externalEvent.end.dateTime || externalEvent.end.date),
        isAllDay: !externalEvent.start.dateTime,
        location: externalEvent.location,
        eventType: 'meeting',
        source,
        externalEventId: externalEvent.id,
        isSynced: true,
        createdById: userId,
        attendees: externalEvent.attendees ? externalEvent.attendees.map(attendee => ({
          name: attendee.displayName || attendee.email,
          email: attendee.email,
          isRequired: !attendee.optional,
        })) : [],
        metadata: externalEvent,
      });
    }
    
    const savedEvent = await this.calendarEventRepository.save(event);
    return this.formatEventResponse(savedEvent);
  }

  private async formatEventResponse(event: CalendarEvent): Promise<CalendarEventResponseDto> {
    let createdByName = 'Unknown User';
    let leadName = null;
    
    // Get creator's name if available
    if (event.createdBy) {
      createdByName = event.createdBy.displayName || event.createdBy.email;
    } else if (event.createdById) {
      const user = await this.userRepository.findOne({ where: { id: event.createdById } });
      if (user) {
        createdByName = user.displayName || user.email;
      }
    }
    
    // Get lead name if available
    if (event.lead) {
      leadName = `${event.lead.firstName} ${event.lead.lastName}`;
    } else if (event.leadId) {
      const lead = await this.leadRepository.findOne({ where: { id: event.leadId } });
      if (lead) {
        leadName = `${lead.firstName} ${lead.lastName}`;
      }
    }
    
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      isAllDay: event.isAllDay,
      eventType: event.eventType,
      location: event.location,
      attendees: event.attendees,
      leadId: event.leadId,
      leadName,
      createdById: event.createdById,
      createdByName,
      source: event.source,
      isSynced: event.isSynced,
      externalEventId: event.externalEventId,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    };
  }
}