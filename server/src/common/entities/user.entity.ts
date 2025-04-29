import { Entity, Column, BeforeInsert } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: ['admin', 'manager', 'agent'], default: 'agent' })
  role: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}