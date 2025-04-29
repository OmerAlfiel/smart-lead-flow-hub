// server/src/modules/teams/repositories/team-member.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TeamMember } from '../entities/team-member.entity';

@Injectable()
export class TeamMemberRepository extends Repository<TeamMember> {
  constructor(dataSource: DataSource) {
    super(TeamMember, dataSource.createEntityManager());
  }

  async findByTeam(teamId: string): Promise<TeamMember[]> {
    return this.createQueryBuilder('teamMember')
      .leftJoinAndSelect('teamMember.user', 'user')
      .where('teamMember.teamId = :teamId', { teamId })
      .getMany();
  }

  async findByUserAndTeam(userId: string, teamId: string): Promise<TeamMember> {
    return this.createQueryBuilder('teamMember')
      .where('teamMember.userId = :userId', { userId })
      .andWhere('teamMember.teamId = :teamId', { teamId })
      .getOne();
  }
}