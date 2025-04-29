// server/src/modules/teams/dto/create-team.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty({ example: 'Sales Team' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Team responsible for enterprise sales', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  ownerId: string;
}