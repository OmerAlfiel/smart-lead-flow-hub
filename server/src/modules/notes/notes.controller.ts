// server/src/modules/notes/notes.controller.ts
import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@ApiTags('notes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ status: 201, description: 'The note has been successfully created.' })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Get all notes for a lead' })
  @ApiResponse({ status: 200, description: 'Return all notes for a specific lead.' })
  @ApiParam({ name: 'leadId', description: 'ID of the lead' })
  findByLead(@Param('leadId') leadId: string) {
    return this.notesService.findByLead(leadId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiResponse({ status: 200, description: 'Return the note.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @ApiParam({ name: 'id', description: 'ID of the note' })
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiResponse({ status: 200, description: 'The note has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @ApiParam({ name: 'id', description: 'ID of the note' })
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}