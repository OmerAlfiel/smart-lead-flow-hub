// server/src/modules/invitations/entities/invitation.entity.ts
import { Entity, Column, BeforeInsert } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('invitations')
export class Invitation extends BaseEntity {
  @Column()
  email: string;

  @Column({ type: 'enum', enum: ['admin', 'manager', 'agent'], default: 'agent' })
  role: string;

  @Column({ unique: true })
  token: string;

  @Column({ default: false })
  used: boolean;

  @Column()
  expiresAt: Date;

  @BeforeInsert()
  generateToken() {
    this.token = uuidv4();
    // Set expiration to 7 days from now
    this.expiresAt = new Date();
    this.expiresAt.setDate(this.expiresAt.getDate() + 7);
  }
}