// server/src/modules/notes/dto/create-note.dto.ts
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ example: 'Discussed pricing options and timeline.' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  leadId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  createdById: string;
}