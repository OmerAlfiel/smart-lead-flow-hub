// server/src/modules/tasks/entities/task.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Lead } from '../../leads/entities/lead.entity';

@Entity('tasks')
export class Task extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  dueDate: Date;

  @Column({ type: 'enum', enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => User, { nullable: true })
  assignedTo: User;

  @ManyToOne(() => Lead, { nullable: true })
  lead: Lead;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}