// server/src/modules/notes/repositories/note.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Note } from '../entities/note.entity';

@Injectable()
export class NoteRepository extends Repository<Note> {
  constructor(dataSource: DataSource) {
    super(Note, dataSource.createEntityManager());
  }

  async findByLead(leadId: string): Promise<Note[]> {
    return this.createQueryBuilder('note')
      .leftJoinAndSelect('note.createdBy', 'user')
      .where('note.leadId = :leadId', { leadId })
      .orderBy('note.createdAt', 'DESC')
      .getMany();
  }
}