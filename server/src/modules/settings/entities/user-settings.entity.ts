// server/src/modules/settings/entities/user-settings.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  company: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ default: 'UTC' })
  timezone: string;

  @Column({ default: 'en' })
  language: string;

  @Column({ default: 'light' })
  theme: string;

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