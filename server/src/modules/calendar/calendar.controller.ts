// server/src/modules/calendar/calendar.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { DateRangeDto } from './dto/date-range.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CalendarEventResponseDto } from './dto/calendar-event-response.dto';

@ApiTags('calendar')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar event' })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.', type: CalendarEventResponseDto })
  create(@Body() createCalendarEventDto: CreateCalendarEventDto, @Req() req) {
    return this.calendarService.create(createCalendarEventDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calendar events for the current user' })
  @ApiResponse({ status: 200, description: 'Return all calendar events.', type: [CalendarEventResponseDto] })
  findAll(@Req() req) {
    return this.calendarService.findAll(req.user.id);
  }

  @Get('date-range')
  @ApiOperation({ summary: 'Get calendar events within a date range' })
  @ApiResponse({ status: 200, description: 'Return calendar events within the specified date range.', type: [CalendarEventResponseDto] })
  findByDateRange(@Query() dateRangeDto: DateRangeDto) {
    return this.calendarService.findByDateRange(dateRangeDto);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming calendar events' })
  @ApiResponse({ status: 200, description: 'Return upcoming calendar events.', type: [CalendarEventResponseDto] })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findUpcoming(@Req() req, @Query('limit') limit?: number) {
    return this.calendarService.findUpcoming(req.user.id, limit);
  }

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Get calendar events for a specific lead' })
  @ApiResponse({ status: 200, description: 'Return calendar events for the specified lead.', type: [CalendarEventResponseDto] })
  @ApiParam({ name: 'leadId', description: 'ID of the lead' })
  findByLead(@Param('leadId') leadId: string) {
    return this.calendarService.findByLead(leadId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a calendar event by ID' })
  @ApiResponse({ status: 200, description: 'Return the calendar event.', type: CalendarEventResponseDto })
  @ApiResponse({ status: 404, description: 'Calendar event not found.' })
  @ApiParam({ name: 'id', description: 'ID of the calendar event' })
  findOne(@Param('id') id: string) {
    return this.calendarService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a calendar event' })
  @ApiResponse({ status: 200, description: 'The calendar event has been successfully updated.', type: CalendarEventResponseDto })
  @ApiResponse({ status: 404, description: 'Calendar event not found.' })
  @ApiParam({ name: 'id', description: 'ID of the calendar event' })
  update(@Param('id') id: string, @Body() updateCalendarEventDto: UpdateCalendarEventDto) {
    return this.calendarService.update(id, updateCalendarEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a calendar event' })
  @ApiResponse({ status: 200, description: 'The calendar event has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Calendar event not found.' })
  @ApiParam({ name: 'id', description: 'ID of the calendar event' })
  remove(@Param('id') id: string) {
    return this.calendarService.remove(id);
  }
}