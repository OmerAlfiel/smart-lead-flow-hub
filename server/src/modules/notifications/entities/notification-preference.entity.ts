// server/src/modules/notifications/entities/notification-preference.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('notification_preferences')
export class NotificationPreference extends BaseEntity {
  @ManyToOne(() => User)
  user: User;

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
}