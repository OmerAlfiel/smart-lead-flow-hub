import { IsNotEmpty, IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfigureIntegrationDto {
  @ApiProperty({ example: 'mailchimp' })
  @IsNotEmpty()
  @IsString()
  provider: string;

  @ApiProperty({ example: { apiKey: 'your-api-key', domain: 'your-domain' } })
  @IsNotEmpty()
  @IsObject()
  credentials: Record<string, any>;

  @ApiProperty({ example: { syncContacts: true, syncCampaigns: true } })
  @IsObject()
  settings: Record<string, any>;
}