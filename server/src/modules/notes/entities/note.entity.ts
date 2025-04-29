// server/src/modules/notes/entities/note.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Lead } from '../../leads/entities/lead.entity';

@Entity('notes')
export class Note extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Lead, lead => lead.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ name: 'lead_id' })
  leadId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: string;
}