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

  @Column({ default: '#4f46e5' })
  primaryColor: string;

  @Column({ default: '#f97316' })
  secondaryColor: string;

  @Column({ default: true })
  enableRegistration: boolean;

  @Column({ default: 7 })
  invitationExpiryDays: number;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}