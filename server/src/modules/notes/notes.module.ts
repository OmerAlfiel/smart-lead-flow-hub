// server/src/modules/notes/notes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';

import { Note } from './entities/note.entity';
import { NoteRepository } from './repositories/note.repository';
import { NotesController } from './notes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  controllers: [NotesController],
  providers: [NotesService, NoteRepository],
  exports: [NotesService],
})
export class NotesModule {}