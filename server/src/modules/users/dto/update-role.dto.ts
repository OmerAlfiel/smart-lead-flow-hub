// server/src/modules/users/dto/update-role.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {
  @ApiProperty({ enum: ['admin', 'manager', 'agent'] })
  @IsEnum(['admin', 'manager', 'agent'])
  @IsNotEmpty()
  role: string;
}