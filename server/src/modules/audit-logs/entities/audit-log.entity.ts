// server/src/modules/audit-logs/entities/audit-log.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export type EntityType = 'lead' | 'task' | 'user' | 'note' | 'campaign' | 'integration' | 'team' | 'file';
export type ActionType = 'create' | 'update' | 'delete' | 'view' | 'login' | 'logout' | 'export' | 'import';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column({ type: 'enum', enum: ['lead', 'task', 'user', 'note', 'campaign', 'integration', 'team', 'file'] })
  entityType: EntityType;

  @Column({ nullable: true })
  entityId: string;

  @Column({ type: 'enum', enum: ['create', 'update', 'delete', 'view', 'login', 'logout', 'export', 'import'] })
  action: ActionType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValues: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newValues: Record<string, any>;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;
}