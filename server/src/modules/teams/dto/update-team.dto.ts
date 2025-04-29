// server/src/modules/teams/dto/update-team.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', required: false })
  @IsOptional()
  @IsUUID()
  ownerId?: string;
}