// server/src/modules/teams/entities/team-member.entity.ts
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';

export enum TeamMemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
  READONLY = 'readonly'
}

@Entity('team_members')
export class TeamMember extends BaseEntity {
  @ManyToOne(() => Team, team => team.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    type: 'enum',
    enum: TeamMemberRole,
    default: TeamMemberRole.MEMBER
  })
  role: TeamMemberRole;
}