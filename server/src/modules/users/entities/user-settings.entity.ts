// server/src/modules/users/entities/user-settings.entity.ts
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from './user.entity';

@Entity('user_settings')
export class UserSettings extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ default: 'light' })
  theme: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: true })
  emailNotifications: boolean;

  @Column({ default: true })
  pushNotifications: boolean;

  @Column({ type: 'jsonb', nullable: true })
  dashboardLayout: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;
}