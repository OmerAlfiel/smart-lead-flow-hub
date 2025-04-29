// server/src/modules/teams/dto/add-team-member.dto.ts
import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeamMemberRole } from '../entities/team-member.entity';

export class AddTeamMemberDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty({ 
    example: 'member',
    enum: TeamMemberRole,
    default: TeamMemberRole.MEMBER
  })
  @IsEnum(TeamMemberRole)
  role: TeamMemberRole = TeamMemberRole.MEMBER;
}