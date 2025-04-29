// server/src/modules/notes/notes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteRepository } from './repositories/note.repository';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    private noteRepository: NoteRepository,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const note = this.notesRepository.create({
      content: createNoteDto.content,
      leadId: createNoteDto.leadId,
      createdById: createNoteDto.createdById,
    });
    
    return this.notesRepository.save(note);
  }

  async findByLead(leadId: string): Promise<Note[]> {
    return this.noteRepository.findByLead(leadId);
  }

  async findOne(id: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    
    if (updateNoteDto.content) {
      note.content = updateNoteDto.content;
    }
    
    return this.notesRepository.save(note);
  }

  async remove(id: string): Promise<void> {
    const note = await this.findOne(id);
    await this.notesRepository.softRemove(note);
  }
}