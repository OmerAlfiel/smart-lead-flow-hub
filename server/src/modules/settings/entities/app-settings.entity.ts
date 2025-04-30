// server/src/modules/settings/entities/app-settings.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('app_settings')
export class AppSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'Smart Lead Flow Hub' })
  companyName: string;

  @Column({ nullable: true })
  companyLogo: string;

  @Column({ nullable: true })
  primaryColor: string;

  @Column({ nullable: true })
  secondaryColor: string;

  @Column({ default: true })
  enableRegistration: boolean;

  @Column({ default: 7 })
  invitationExpiryDays: number;

  @Column({ type: 'jsonb', default: {} })
  customFields: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}