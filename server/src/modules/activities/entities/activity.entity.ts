// server/src/modules/activities/entities/activity.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('activities')
export class Activity extends BaseEntity {
  @Column()
  action: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['lead', 'task', 'user', 'integration', 'system'], default: 'system' })
  entityType: string;

  @Column({ nullable: true })
  entityId: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}