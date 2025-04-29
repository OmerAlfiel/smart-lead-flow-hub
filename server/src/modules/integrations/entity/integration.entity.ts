// server/src/modules/integrations/entities/integration.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('integrations')
export class Integration extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

  @Column()
  provider: string;

  @Column({ type: 'enum', enum: ['email', 'crm', 'calendar', 'messaging', 'video', 'other'], default: 'other' })
  type: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  credentials: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  lastSynced: Date;
}