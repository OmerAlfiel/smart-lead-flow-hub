import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

@ApiTags('leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  @ApiResponse({ status: 201, description: 'Lead created successfully' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  @ApiResponse({ status: 200, description: 'Return all leads' })
  findAll(@Query('status') status?: string) {
    return this.leadsService.findAll(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a lead by id' })
  @ApiResponse({ status: 200, description: 'Return the lead' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead' })
  @ApiResponse({ status: 200, description: 'Lead updated successfully' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a lead' })
  @ApiResponse({ status: 200, description: 'Lead deleted successfully' })
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }
}