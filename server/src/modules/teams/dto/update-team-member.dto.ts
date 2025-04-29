// server/src/modules/teams/dto/update-team-member.dto.ts
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamMemberRole } from '../entities/team-member.entity';

export class UpdateTeamMemberDto {
  @ApiProperty({ 
    example: 'admin',
    enum: TeamMemberRole
  })
  @IsEnum(TeamMemberRole)
  role: TeamMemberRole;
}