// server/src/modules/settings/dto/update-integration-settings.dto.ts
import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class UpdateIntegrationSettingsDto {
  @IsOptional()
  @IsBoolean()
  google?: boolean;

  @IsOptional()
  @IsObject()
  googleConfig?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  office365?: boolean;

  @IsOptional()
  @IsObject()
  office365Config?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  slack?: boolean;

  @IsOptional()
  @IsObject()
  slackConfig?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  zoom?: boolean;

  @IsOptional()
  @IsObject()
  zoomConfig?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  hubspot?: boolean;

  @IsOptional()
  @IsObject()
  hubspotConfig?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  salesforce?: boolean;

  @IsOptional()
  @IsObject()
  salesforceConfig?: Record<string, any>;
}