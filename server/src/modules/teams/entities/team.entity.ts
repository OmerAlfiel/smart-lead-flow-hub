// server/src/modules/teams/entities/team.entity.ts
import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { TeamMember } from './team-member.entity';


@Entity('teams')
export class Team extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @OneToMany(() => TeamMember, member => member.team)
  members: TeamMember[];
}