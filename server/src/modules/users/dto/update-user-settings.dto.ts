// server/src/modules/users/dto/update-user-settings.dto.ts
import { IsOptional, IsString, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  dashboardLayout?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;
}