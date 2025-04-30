// server/src/modules/settings/entities/notification-settings.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notification_settings')
export class NotificationSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: true })
  emailNewLead: boolean;

  @Column({ default: true })
  emailLeadUpdate: boolean;

  @Column({ default: true })
  emailTaskReminders: boolean;

  @Column({ default: true })
  emailReports: boolean;

  @Column({ default: true })
  pushNewLead: boolean;

  @Column({ default: false })
  pushLeadUpdate: boolean;

  @Column({ default: true })
  pushTaskReminders: boolean;

  @Column({ default: false })
  pushReports: boolean;

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