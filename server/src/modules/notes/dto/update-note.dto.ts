// server/src/modules/notes/dto/update-note.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  @ApiProperty({ example: 'Updated content for the note', required: false })
  @IsOptional()
  @IsNotEmpty()
  content?: string;
}