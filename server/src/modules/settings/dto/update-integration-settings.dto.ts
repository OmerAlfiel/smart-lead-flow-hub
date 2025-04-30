// server/src/modules/settings/dto/update-integration-settings.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsObject } from 'class-validator';

export class UpdateIntegrationSettingsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  google?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  googleConfig?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  office365?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  office365Config?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  slack?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  slackConfig?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  zoom?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  zoomConfig?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  hubspot?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  hubspotConfig?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  salesforce?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  salesforceConfig?: Record<string, any>;
}