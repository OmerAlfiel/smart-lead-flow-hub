// server/src/modules/files/entities/file.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('files')
export class File extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ type: 'enum', enum: ['avatar', 'lead', 'document'], default: 'document' })
  type: string;

  @Column({ nullable: true })
  entityId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by_id' })
  uploadedBy: User;

  @Column({ name: 'uploaded_by_id', nullable: true })
  uploadedById: string;
}