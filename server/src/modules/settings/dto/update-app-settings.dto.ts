// server/src/modules/settings/dto/update-app-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsNumber, IsObject } from 'class-validator';

export class UpdateAppSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyLogo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  enableRegistration?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  invitationExpiryDays?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}