// server/src/modules/invitations/dto/create-invitation.dto.ts
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'agent', enum: ['admin', 'manager', 'agent'] })
  @IsEnum(['admin', 'manager', 'agent'])
  @IsNotEmpty()
  role: string;
}