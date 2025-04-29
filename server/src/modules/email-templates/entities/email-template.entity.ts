// server/src/modules/email-templates/entities/email-template.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

export enum EmailTemplateType {
  NEW_LEAD = 'new_lead',
  LEAD_UPDATE = 'lead_update',
  TASK_REMINDER = 'task_reminder',
  WEEKLY_REPORT = 'weekly_report',
  CUSTOM = 'custom'
}

@Entity('email_templates')
export class EmailTemplate extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: EmailTemplateType, default: EmailTemplateType.CUSTOM })
  type: EmailTemplateType;

  @Column()
  subject: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  htmlContent: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  variables: Record<string, any>;
}