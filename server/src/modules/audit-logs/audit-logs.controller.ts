// server/src/modules/audit-logs/audit-logs.controller.ts
import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('audit-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new audit log entry' })
  @ApiResponse({ status: 201, description: 'The audit log has been successfully created.' })
  create(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditLogsService.create(createAuditLogDto);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all audit logs with optional filtering' })
  @ApiResponse({ status: 200, description: 'Return all audit logs that match the query parameters.' })
  findAll(@Query() query: QueryAuditLogsDto) {
    return this.auditLogsService.findAll(query);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get a specific audit log by ID' })
  @ApiResponse({ status: 200, description: 'Return the audit log.' })
  @ApiResponse({ status: 404, description: 'Audit log not found.' })
  @ApiParam({ name: 'id', description: 'ID of the audit log' })
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(id);
  }

  @Get('entity/:type/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get audit logs for a specific entity' })
  @ApiResponse({ status: 200, description: 'Return audit logs for the entity.' })
  @ApiParam({ name: 'type', description: 'Type of the entity (lead, task, etc.)' })
  @ApiParam({ name: 'id', description: 'ID of the entity' })
  findByEntity(@Param('type') type: string, @Param('id') id: string) {
    return this.auditLogsService.findByEntity(type as any, id);
  }

  @Get('user/:id')
  @Roles('admin')
  @ApiOperation({ summary: 'Get audit logs for a specific user' })
  @ApiResponse({ status: 200, description: 'Return audit logs for the user.' })
  @ApiParam({ name: 'id', description: 'ID of the user' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  findByUser(
    @Param('id') id: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const startDateTime = startDate ? new Date(startDate) : undefined;
    const endDateTime = endDate ? new Date(endDate) : undefined;
    return this.auditLogsService.findByUser(id, startDateTime, endDateTime);
  }
}