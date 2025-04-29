// server/src/modules/leads/entities/lead.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('leads')
export class Lead extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ 
    type: 'enum', 
    enum: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'], 
    default: 'new' 
  })
  status: string;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ nullable: true })
  source: string;

  @ManyToOne(() => User, { nullable: true })
  assignedTo: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToMany(() => Note, note => note.lead)
  notes: Note[];
}