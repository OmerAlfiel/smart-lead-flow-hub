// server/src/modules/activities/activities.controller.ts
import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('activities')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  @ApiResponse({ status: 201, description: 'Activity created successfully' })
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get recent activities' })
  @ApiResponse({ status: 200, description: 'Return recent activities' })
  findRecentActivities(@Query('limit') limit: number = 10) {
    return this.activitiesService.findRecentActivities(limit);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get activities by user' })
  @ApiResponse({ status: 200, description: 'Return user activities' })
  findByUser(@Query('userId') userId: string, @Query('limit') limit: number = 20) {
    return this.activitiesService.findByUser(userId, limit);
  }

  @Get('entity')
  @ApiOperation({ summary: 'Get activities by entity type' })
  @ApiResponse({ status: 200, description: 'Return entity activities' })
  findByEntityType(@Query('type') entityType: string, @Query('limit') limit: number = 20) {
    return this.activitiesService.findByEntityType(entityType, limit);
  }
}