// server/src/modules/reports/reports.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Put, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new report' })
  @ApiResponse({ status: 201, description: 'The report has been successfully created.' })
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reports or reports by user' })
  @ApiResponse({ status: 200, description: 'Return all reports or reports by user.' })
  @ApiQuery({ name: 'userId', required: false })
  findAll(@Query('userId') userId?: string) {
    if (userId) {
      return this.reportsService.findByUser(userId);
    }
    return this.reportsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a report by ID' })
  @ApiResponse({ status: 200, description: 'Return the report.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiParam({ name: 'id', description: 'ID of the report' })
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a report' })
  @ApiResponse({ status: 200, description: 'The report has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiParam({ name: 'id', description: 'ID of the report' })
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(id, updateReportDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a report' })
  @ApiResponse({ status: 200, description: 'The report has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiParam({ name: 'id', description: 'ID of the report' })
  remove(@Param('id') id: string) {
    return this.reportsService.remove(id);
  }

  @Post(':id/generate')
  @ApiOperation({ summary: 'Generate a report' })
  @ApiResponse({ status: 200, description: 'The report has been successfully generated.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiParam({ name: 'id', description: 'ID of the report' })
  generate(@Param('id') id: string) {
    return this.reportsService.generateReport(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a report' })
  @ApiResponse({ status: 200, description: 'Return the report file.' })
  @ApiResponse({ status: 404, description: 'Report not found.' })
  @ApiParam({ name: 'id', description: 'ID of the report' })
  async download(@Param('id') id: string, @Res() res: Response) {
    const report = await this.reportsService.findOne(id);
    
    if (!report.filePath) {
      return res.status(404).json({ message: 'Report file not found' });
    }
    
    const filePath = path.join(process.cwd(), report.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Report file not found' });
    }
    
    return res.download(filePath, `${report.name}.${report.filePath.split('.').pop()}`);
  }
}