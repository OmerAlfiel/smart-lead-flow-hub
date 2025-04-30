// server/src/modules/settings/entities/integration-settings.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('integration_settings')
export class IntegrationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  google: boolean;

  @Column({ type: 'jsonb', nullable: true })
  googleConfig: Record<string, any>;

  @Column({ default: false })
  office365: boolean;

  @Column({ type: 'jsonb', nullable: true })
  office365Config: Record<string, any>;

  @Column({ default: false })
  slack: boolean;

  @Column({ type: 'jsonb', nullable: true })
  slackConfig: Record<string, any>;

  @Column({ default: false })
  zoom: boolean;

  @Column({ type: 'jsonb', nullable: true })
  zoomConfig: Record<string, any>;

  @Column({ default: false })
  hubspot: boolean;

  @Column({ type: 'jsonb', nullable: true })
  hubspotConfig: Record<string, any>;

  @Column({ default: false })
  salesforce: boolean;

  @Column({ type: 'jsonb', nullable: true })
  salesforceConfig: Record<string, any>;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}