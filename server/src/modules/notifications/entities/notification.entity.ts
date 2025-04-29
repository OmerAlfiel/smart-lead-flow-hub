import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: ['info', 'success', 'warning', 'error'], default: 'info' })
  type: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User)
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}