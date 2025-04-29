// server/src/modules/calendar/entities/calendar-event.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Lead } from '../../leads/entities/lead.entity';

@Entity('calendar_events')
export class CalendarEvent extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ default: false })
  isAllDay: boolean;

  @Column({ type: 'enum', enum: ['meeting', 'task', 'reminder', 'other'], default: 'meeting' })
  eventType: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'jsonb', nullable: true })
  attendees: Record<string, any>[];

  @Column({ nullable: true })
  externalEventId: string;

  @Column({ type: 'enum', enum: ['google', 'office365', 'none'], default: 'none' })
  source: string;

  @Column({ default: false })
  isSynced: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => Lead, { nullable: true })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @Column({ name: 'lead_id', nullable: true })
  leadId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;
}