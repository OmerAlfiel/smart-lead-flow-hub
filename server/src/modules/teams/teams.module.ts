// server/src/modules/teams/teams.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { TeamRepository } from './repositories/team.repository';
import { TeamMemberRepository } from './repositories/team-member.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamMember])],
  controllers: [TeamsController],
  providers: [TeamsService, TeamRepository, TeamMemberRepository],
  exports: [TeamsService],
})
export class TeamsModule {}