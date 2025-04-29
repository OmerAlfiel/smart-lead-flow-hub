// server/src/modules/teams/repositories/team.repository.ts
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Team } from '../entities/team.entity';

@Injectable()
export class TeamRepository extends Repository<Team> {
  constructor(private dataSource: DataSource) {
    super(Team, dataSource.createEntityManager());
  }

  async findByUser(userId: string): Promise<Team[]> {
    return this.createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('team.ownerId = :userId', { userId })
      .orWhere('member.userId = :userId', { userId })
      .getMany();
  }

  async findWithMembers(id: string): Promise<Team> {
    return this.createQueryBuilder('team')
      .leftJoinAndSelect('team.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('team.id = :id', { id })
      .getOne();
  }
}