// server/src/modules/users/dto/change-password.dto.ts
import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentPassword123' })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ example: 'newPassword123' })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}