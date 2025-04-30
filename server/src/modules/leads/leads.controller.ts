import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateNoteDto } from '../notes/dto/create-note.dto';

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

  @Get(':id/with-notes')
  @ApiOperation({ summary: 'Get a lead by id with its notes' })
  @ApiResponse({ status: 200, description: 'Return the lead with notes' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  findOneWithNotes(@Param('id') id: string) {
    return this.leadsService.findOneWithNotes(id);
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

  // Notes related endpoints
  @Get(':id/notes')
  @ApiOperation({ summary: 'Get all notes for a lead' })
  @ApiResponse({ status: 200, description: 'Return all notes for the lead' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiParam({ name: 'id', description: 'ID of the lead' })
  getLeadNotes(@Param('id') id: string) {
    return this.leadsService.getLeadNotes(id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add a note to a lead' })
  @ApiResponse({ status: 201, description: 'Note added successfully' })
  @ApiResponse({ status: 404, description: 'Lead not found' })
  @ApiParam({ name: 'id', description: 'ID of the lead' })
  addNoteToLead(@Param('id') id: string, @Body() createNoteDto: CreateNoteDto) {
    // Ensure the leadId in the DTO matches the path parameter
    createNoteDto.leadId = id;
    return this.leadsService.addNoteToLead(createNoteDto);
  }

  @Delete('notes/:noteId')
  @ApiOperation({ summary: 'Remove a note from a lead' })
  @ApiResponse({ status: 200, description: 'Note removed successfully' })
  @ApiResponse({ status: 404, description: 'Note not found' })
  @ApiParam({ name: 'noteId', description: 'ID of the note to remove' })
  removeNoteFromLead(@Param('noteId') noteId: string) {
    return this.leadsService.removeNoteFromLead(noteId);
  }
}