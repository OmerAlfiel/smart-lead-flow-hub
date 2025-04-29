// server/src/modules/campaigns/entities/campaign.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('campaigns')
export class Campaign extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ 
    type: 'enum', 
    enum: ['draft', 'active', 'paused', 'completed'], 
    default: 'draft' 
  })
  status: string;

  @Column({ type: 'date', nullable: true })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date;

  @Column({ type: 'jsonb', nullable: true })
  metrics: {
    sentEmails: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    [key: string]: any;
  };

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;
}