// server/src/modules/settings/dto/update-app-settings.dto.ts
import { IsBoolean, IsNumber, IsObject, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateAppSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  companyName?: string;

  @IsOptional()
  @IsString()
  companyLogo?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  secondaryColor?: string;

  @IsOptional()
  @IsBoolean()
  enableRegistration?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(1)
  invitationExpiryDays?: number;

  @IsOptional()
  @IsObject()
  customFields?: Record<string, any>;
}