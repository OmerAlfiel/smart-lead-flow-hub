// server/src/modules/settings/entities/integration-settings.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('integration_settings')
export class IntegrationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  google: boolean;

  @Column({ type: 'json', nullable: true })
  googleConfig: Record<string, any>;

  @Column({ default: false })
  office365: boolean;

  @Column({ type: 'json', nullable: true })
  office365Config: Record<string, any>;

  @Column({ default: false })
  slack: boolean;

  @Column({ type: 'json', nullable: true })
  slackConfig: Record<string, any>;

  @Column({ default: false })
  zoom: boolean;

  @Column({ type: 'json', nullable: true })
  zoomConfig: Record<string, any>;

  @Column({ default: false })
  hubspot: boolean;

  @Column({ type: 'json', nullable: true })
  hubspotConfig: Record<string, any>;

  @Column({ default: false })
  salesforce: boolean;

  @Column({ type: 'json', nullable: true })
  salesforceConfig: Record<string, any>;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}